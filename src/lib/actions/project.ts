'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { requireUser } from '@/lib/auth';
import { NAV_COUNTS_TAG, FEATURED_PROJECTS_TAG } from '@/lib/data/cache-tags';
import { createProjectSchema, updateProjectSchema } from '@/lib/validations/project';
import {
  createProject,
  updateProject,
  deactivateProject,
  reactivateProject,
  getProjectSlugById,
  slugExists,
  getCaptureMedia,
  markCaptureStarted,
} from '@/lib/data/project';
import { pgErrorOf } from '@/lib/db/errors';
import { enqueue } from '@/lib/jobs/boss';
import { MEDIA_CAPTURE_QUEUE } from '@/lib/media-capture/config';
import { logger } from '@/lib/logger';
import type {
  CreateProjectInput,
  UpdateProjectInput,
  ProjectMutationResult,
  CaptureJob,
} from '@/types/project';

export type ProjectActionResult = { ok: true } | { ok: false; error: string };

function revalidate(slugs: (string | null | undefined)[], projectId?: string): void {
  revalidateTag(NAV_COUNTS_TAG);
  revalidateTag(FEATURED_PROJECTS_TAG);
  revalidatePath('/');
  revalidatePath('/work');
  revalidatePath('/dashboard/projects');
  revalidatePath('/sitemap.xml');
  if (projectId) revalidatePath(`/dashboard/projects/${projectId}/edit`);
  for (const slug of slugs) {
    if (slug) revalidatePath(`/work/${slug}`);
  }
}

function firstIssue(issues: { path: PropertyKey[]; message: string }[]): {
  error: string;
  field?: string;
} {
  const issue = issues[0];
  if (!issue) return { error: 'Invalid data' };
  const field = issue.path.map(String).join('.');
  return { error: field ? `${field}: ${issue.message}` : issue.message, field };
}

const UNIQUE_VIOLATIONS: Record<string, { error: string; field: string }> = {
  pyramid_projects_slug_unique: { error: 'That slug is already taken', field: 'slug' },
  uq_pyramid_project_media_featured: {
    error: 'Only one asset can be the featured visual',
    field: 'media',
  },
  uq_pyramid_project_actions_primary: { error: 'Only one action can be primary', field: 'actions' },
};

function mutationError(e: unknown, fallback: string): ProjectMutationResult {
  const pgError = pgErrorOf(e);
  const known =
    pgError?.code === '23505' && pgError.constraint
      ? UNIQUE_VIOLATIONS[pgError.constraint]
      : undefined;
  if (known) return { ok: false, ...known };

  logger.error('project mutation failed', {
    message: e instanceof Error ? e.message : String(e),
    code: pgError?.code,
    constraint: pgError?.constraint,
  });
  return { ok: false, error: fallback };
}

export async function createProjectAction(
  data: CreateProjectInput,
): Promise<ProjectMutationResult> {
  await requireUser();
  const parsed = createProjectSchema.safeParse(data);
  if (!parsed.success) return { ok: false, ...firstIssue(parsed.error.issues) };

  if (await slugExists(parsed.data.slug)) {
    return { ok: false, error: 'That slug is already taken', field: 'slug' };
  }

  try {
    const project = await createProject(parsed.data);
    revalidate([project.slug], project.id);
    return { ok: true, id: project.id, slug: project.slug };
  } catch (e) {
    return mutationError(e, 'Could not create the project');
  }
}

export async function updateProjectAction(
  id: string,
  data: UpdateProjectInput,
): Promise<ProjectMutationResult> {
  await requireUser();
  const parsed = updateProjectSchema.safeParse(data);
  if (!parsed.success) return { ok: false, ...firstIssue(parsed.error.issues) };

  if (await slugExists(parsed.data.slug, id)) {
    return { ok: false, error: 'That slug is already taken', field: 'slug' };
  }

  const previousSlug = await getProjectSlugById(id);

  try {
    const project = await updateProject(id, parsed.data);
    revalidate([project.slug, previousSlug], id);
    return { ok: true, id: project.id, slug: project.slug };
  } catch (e) {
    return mutationError(e, 'Could not save the project');
  }
}

export async function deactivateProjectAction(id: string): Promise<ProjectActionResult> {
  await requireUser();
  const slug = await getProjectSlugById(id);
  try {
    await deactivateProject(id);
  } catch (e) {
    logger.error('project deactivate failed', { id, error: String(e) });
    return { ok: false, error: 'Could not deactivate the project' };
  }
  revalidate([slug], id);
  return { ok: true };
}

export async function reactivateProjectAction(id: string): Promise<ProjectActionResult> {
  await requireUser();
  const slug = await getProjectSlugById(id);
  try {
    await reactivateProject(id);
  } catch (e) {
    logger.error('project reactivate failed', { id, error: String(e) });
    return { ok: false, error: 'Could not reactivate the project' };
  }
  revalidate([slug], id);
  return { ok: true };
}

export async function requestProjectCaptureAction(mediaId: string): Promise<ProjectActionResult> {
  await requireUser();

  const media = await getCaptureMedia(mediaId);
  if (!media) return { ok: false, error: 'Media not found' };
  if (!media.sourceUrl) return { ok: false, error: 'This asset has no capture source URL' };

  const job: CaptureJob = {
    projectId: media.projectId,
    mediaId: media.id,
    sourceType: 'website',
    sourceUrl: media.sourceUrl,
    viewport: { width: 1440, height: 900 },
    requestedAt: new Date().toISOString(),
    idempotencyKey: `${media.id}:${Date.now()}`,
  };

  const sent = await enqueue(MEDIA_CAPTURE_QUEUE, job);
  if (!sent) return { ok: false, error: 'Media capture is not available right now' };

  await markCaptureStarted(mediaId);
  revalidatePath('/dashboard/projects');
  return { ok: true };
}
