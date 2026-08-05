import { cache } from 'react';
import { or, and, eq, ne, isNull, gt, asc, desc, inArray, sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import {
  pyramidProjects,
  pyramidProjectMedia,
  pyramidProjectActions,
  pyramidProjectSections,
  type PyramidProjectRow,
  type PyramidProjectMediaRow,
  type PyramidProjectActionRow,
  type PyramidProjectSectionRow,
} from '@/lib/db/schema/project';
import type {
  ProjectCardDTO,
  ProjectDetailDTO,
  ProjectMediaDTO,
  ProjectActionDTO,
  ProjectSectionDTO,
  AdminProjectDTO,
  AdminProjectListItemDTO,
  CreateProjectInput,
  UpdateProjectInput,
  MediaInput,
  ActionInput,
  SectionInput,
  ProjectOrigin,
  ProjectLifecycle,
  ProjectAvailability,
  ProjectPlatform,
  ProjectService,
  MediaKind,
  ActionKind,
  CaptureStatus,
  SectionPayload,
} from '@/types/project';

export const activeProjectFilter = or(
  isNull(pyramidProjects.deactivatedAt),
  gt(pyramidProjects.reactivatedAt, pyramidProjects.deactivatedAt),
);

const publicOrder = [asc(pyramidProjects.displayOrder), desc(pyramidProjects.createdAt)];

function isActive(row: PyramidProjectRow): boolean {
  if (!row.deactivatedAt) return true;
  return Boolean(row.reactivatedAt && row.reactivatedAt > row.deactivatedAt);
}

function toMediaDTO(row: PyramidProjectMediaRow): ProjectMediaDTO {
  return {
    id: row.id,
    kind: row.kind as MediaKind,
    url: row.url,
    posterUrl: row.posterUrl,
    sourceUrl: row.sourceUrl,
    provider: row.provider,
    altText: row.altText,
    caption: row.caption,
    platform: row.platform as ProjectPlatform | null,
    isFeatured: row.isFeatured,
    displayOrder: row.displayOrder,
    captureStatus: row.captureStatus as CaptureStatus | null,
    capturedAt: row.capturedAt,
    captureError: row.captureError,
  };
}

function toActionDTO(row: PyramidProjectActionRow): ProjectActionDTO {
  return {
    id: row.id,
    kind: row.kind as ActionKind,
    label: row.label,
    url: row.url,
    isPrimary: row.isPrimary,
    displayOrder: row.displayOrder,
  };
}

function toSectionDTO(row: PyramidProjectSectionRow): ProjectSectionDTO {
  return {
    id: row.id,
    heading: row.heading,
    displayOrder: row.displayOrder,
    payload: row.payload as SectionPayload,
  };
}

export function resolveFeaturedMedia(media: ProjectMediaDTO[]): ProjectMediaDTO | null {
  const usable = media.filter((m) => m.url);
  const manual = usable.find((m) => m.isFeatured && m.kind !== 'capture');
  if (manual) return manual;

  const capture = usable.find((m) => m.kind === 'capture' && m.captureStatus === 'succeeded');
  if (capture) return capture;

  const featuredCapture = usable.find((m) => m.isFeatured);
  if (featuredCapture) return featuredCapture;

  const gallery = [...usable].sort((a, b) => a.displayOrder - b.displayOrder)[0];
  if (gallery) return gallery;

  const poster = media.find((m) => m.posterUrl);
  if (poster) return { ...poster, url: poster.posterUrl };

  return null;
}

export function resolvePrimaryAction(actions: ProjectActionDTO[]): ProjectActionDTO | null {
  return actions.find((a) => a.isPrimary) ?? null;
}

function toCardDTO(
  row: PyramidProjectRow,
  media: ProjectMediaDTO[],
  actions: ProjectActionDTO[],
): ProjectCardDTO {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    origin: row.origin as ProjectOrigin,
    lifecycle: row.lifecycle as ProjectLifecycle,
    availability: row.availability as ProjectAvailability,
    client: row.client,
    timeframe: row.timeframe,
    platforms: row.platforms as ProjectPlatform[],
    services: row.services as ProjectService[],
    featuredMedia: resolveFeaturedMedia(media),
    primaryAction: resolvePrimaryAction(actions),
  };
}

function groupBy<Row extends { projectId: string }, Dto>(
  rows: Row[],
  toDto: (row: Row) => Dto,
): Map<string, Dto[]> {
  const map = new Map<string, Dto[]>();
  for (const row of rows) {
    const list = map.get(row.projectId);
    if (list) list.push(toDto(row));
    else map.set(row.projectId, [toDto(row)]);
  }
  return map;
}

async function loadMedia(projectIds: string[]): Promise<Map<string, ProjectMediaDTO[]>> {
  if (projectIds.length === 0) return new Map();
  const rows = await db
    .select()
    .from(pyramidProjectMedia)
    .where(inArray(pyramidProjectMedia.projectId, projectIds))
    .orderBy(asc(pyramidProjectMedia.displayOrder));
  return groupBy(rows, toMediaDTO);
}

async function loadActions(projectIds: string[]): Promise<Map<string, ProjectActionDTO[]>> {
  if (projectIds.length === 0) return new Map();
  const rows = await db
    .select()
    .from(pyramidProjectActions)
    .where(inArray(pyramidProjectActions.projectId, projectIds))
    .orderBy(asc(pyramidProjectActions.displayOrder));
  return groupBy(rows, toActionDTO);
}

async function loadSections(projectIds: string[]): Promise<Map<string, ProjectSectionDTO[]>> {
  if (projectIds.length === 0) return new Map();
  const rows = await db
    .select()
    .from(pyramidProjectSections)
    .where(inArray(pyramidProjectSections.projectId, projectIds))
    .orderBy(asc(pyramidProjectSections.displayOrder));
  return groupBy(rows, toSectionDTO);
}

async function toCards(rows: PyramidProjectRow[]): Promise<ProjectCardDTO[]> {
  const ids = rows.map((r) => r.id);
  const [media, actions] = await Promise.all([loadMedia(ids), loadActions(ids)]);
  return rows.map((row) => toCardDTO(row, media.get(row.id) ?? [], actions.get(row.id) ?? []));
}

export async function getFeaturedProjects(limit = 6): Promise<ProjectCardDTO[]> {
  const rows = await db
    .select()
    .from(pyramidProjects)
    .where(and(activeProjectFilter, eq(pyramidProjects.featured, true)))
    .orderBy(...publicOrder)
    .limit(limit);
  return toCards(rows);
}

export async function getActiveProjects(): Promise<ProjectCardDTO[]> {
  const rows = await db
    .select()
    .from(pyramidProjects)
    .where(activeProjectFilter)
    .orderBy(...publicOrder);
  return toCards(rows);
}

export const getActiveProjectCount = cache(async (): Promise<number> => {
  const result = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(pyramidProjects)
    .where(activeProjectFilter);
  return result[0]?.total ?? 0;
});

export async function getActiveProjectSlugs(): Promise<{ slug: string; updatedAt: Date | null }[]> {
  return db
    .select({ slug: pyramidProjects.slug, updatedAt: pyramidProjects.updatedAt })
    .from(pyramidProjects)
    .where(activeProjectFilter)
    .orderBy(...publicOrder);
}

export async function getActiveProjectBySlug(slug: string): Promise<ProjectDetailDTO | null> {
  const rows = await db
    .select()
    .from(pyramidProjects)
    .where(and(activeProjectFilter, eq(pyramidProjects.slug, slug)))
    .limit(1);
  const row = rows[0];
  if (!row) return null;

  const [media, actions, sections] = await Promise.all([
    loadMedia([row.id]),
    loadActions([row.id]),
    loadSections([row.id]),
  ]);
  const projectMedia = media.get(row.id) ?? [];
  const projectActions = actions.get(row.id) ?? [];

  return {
    ...toCardDTO(row, projectMedia, projectActions),
    overview: row.overview,
    industry: row.industry,
    media: projectMedia,
    actions: projectActions,
    sections: sections.get(row.id) ?? [],
  };
}

export interface AdjacentProject {
  slug: string;
  title: string;
}

export async function getAdjacentActiveProjects(
  slug: string,
): Promise<{ previous: AdjacentProject | null; next: AdjacentProject | null }> {
  const ordered = await db
    .select({ slug: pyramidProjects.slug, title: pyramidProjects.title })
    .from(pyramidProjects)
    .where(activeProjectFilter)
    .orderBy(...publicOrder);

  const index = ordered.findIndex((p) => p.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: ordered[index - 1] ?? null,
    next: ordered[index + 1] ?? null,
  };
}

export async function getAdminProjects(): Promise<AdminProjectListItemDTO[]> {
  const rows = await db
    .select()
    .from(pyramidProjects)
    .orderBy(asc(pyramidProjects.displayOrder), desc(pyramidProjects.createdAt));

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    client: row.client,
    origin: row.origin as ProjectOrigin,
    platforms: row.platforms as ProjectPlatform[],
    featured: row.featured,
    displayOrder: row.displayOrder,
    isActive: isActive(row),
    updatedAt: row.updatedAt,
  }));
}

export async function getAdminProjectById(id: string): Promise<AdminProjectDTO | null> {
  const rows = await db.select().from(pyramidProjects).where(eq(pyramidProjects.id, id)).limit(1);
  const row = rows[0];
  if (!row) return null;

  const [media, actions, sections] = await Promise.all([
    loadMedia([row.id]),
    loadActions([row.id]),
    loadSections([row.id]),
  ]);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    overview: row.overview,
    origin: row.origin as ProjectOrigin,
    lifecycle: row.lifecycle as ProjectLifecycle,
    availability: row.availability as ProjectAvailability,
    client: row.client,
    industry: row.industry,
    timeframe: row.timeframe,
    platforms: row.platforms as ProjectPlatform[],
    services: row.services as ProjectService[],
    featured: row.featured,
    displayOrder: row.displayOrder,
    isActive: isActive(row),
    deactivatedAt: row.deactivatedAt,
    reactivatedAt: row.reactivatedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    media: media.get(row.id) ?? [],
    actions: actions.get(row.id) ?? [],
    sections: sections.get(row.id) ?? [],
  };
}

export async function getProjectSlugById(id: string): Promise<string | null> {
  const rows = await db
    .select({ slug: pyramidProjects.slug })
    .from(pyramidProjects)
    .where(eq(pyramidProjects.id, id))
    .limit(1);
  return rows[0]?.slug ?? null;
}

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

function mediaValues(projectId: string, media: MediaInput[]) {
  return media.map((m) => ({
    projectId,
    kind: m.kind,
    url: m.url ?? null,
    posterUrl: m.posterUrl ?? null,
    sourceUrl: m.sourceUrl ?? null,
    provider: m.provider ?? null,
    altText: m.altText ?? null,
    caption: m.caption ?? null,
    platform: m.platform ?? null,
    isFeatured: m.isFeatured,
    displayOrder: m.displayOrder,
    captureStatus: m.kind === 'capture' && !m.url ? 'pending' : null,
  }));
}

function actionValues(projectId: string, actions: ActionInput[]) {
  return actions.map((a) => ({
    projectId,
    kind: a.kind,
    label: a.label,
    url: a.url,
    isPrimary: a.isPrimary,
    displayOrder: a.displayOrder,
  }));
}

function sectionValues(projectId: string, sections: SectionInput[]) {
  return sections.map((s) => ({
    projectId,
    type: s.payload.type,
    heading: s.heading ?? null,
    payload: s.payload,
    displayOrder: s.displayOrder,
  }));
}

async function replaceChildren(tx: Tx, projectId: string, input: CreateProjectInput) {
  await tx.delete(pyramidProjectMedia).where(eq(pyramidProjectMedia.projectId, projectId));
  await tx.delete(pyramidProjectActions).where(eq(pyramidProjectActions.projectId, projectId));
  await tx.delete(pyramidProjectSections).where(eq(pyramidProjectSections.projectId, projectId));

  if (input.media.length > 0) {
    await tx.insert(pyramidProjectMedia).values(mediaValues(projectId, input.media));
  }
  if (input.actions.length > 0) {
    await tx.insert(pyramidProjectActions).values(actionValues(projectId, input.actions));
  }
  if (input.sections.length > 0) {
    await tx.insert(pyramidProjectSections).values(sectionValues(projectId, input.sections));
  }
}

export async function createProject(input: CreateProjectInput): Promise<{ id: string; slug: string }> {
  return db.transaction(async (tx) => {
    const rows = await tx
      .insert(pyramidProjects)
      .values({
        slug: input.slug,
        title: input.title,
        summary: input.summary,
        overview: input.overview,
        origin: input.origin,
        lifecycle: input.lifecycle,
        availability: input.availability,
        client: input.client ?? null,
        industry: input.industry ?? null,
        timeframe: input.timeframe ?? null,
        platforms: input.platforms,
        services: input.services,
        featured: input.featured,
        displayOrder: input.displayOrder,
      })
      .returning({ id: pyramidProjects.id, slug: pyramidProjects.slug });

    const project = rows[0];
    await replaceChildren(tx, project.id, input);
    return project;
  });
}

export async function updateProject(
  id: string,
  input: UpdateProjectInput,
): Promise<{ id: string; slug: string }> {
  return db.transaction(async (tx) => {
    const rows = await tx
      .update(pyramidProjects)
      .set({
        slug: input.slug,
        title: input.title,
        summary: input.summary,
        overview: input.overview,
        origin: input.origin,
        lifecycle: input.lifecycle,
        availability: input.availability,
        client: input.client ?? null,
        industry: input.industry ?? null,
        timeframe: input.timeframe ?? null,
        platforms: input.platforms,
        services: input.services,
        featured: input.featured,
        displayOrder: input.displayOrder,
        updatedAt: new Date(),
      })
      .where(eq(pyramidProjects.id, id))
      .returning({ id: pyramidProjects.id, slug: pyramidProjects.slug });

    const project = rows[0];
    if (!project) throw new Error('Project not found');

    await replaceChildren(tx, project.id, input);
    return project;
  });
}

export async function deactivateProject(id: string): Promise<void> {
  await db
    .update(pyramidProjects)
    .set({ deactivatedAt: new Date(), reactivatedAt: null, updatedAt: new Date() })
    .where(eq(pyramidProjects.id, id));
}

export async function reactivateProject(id: string): Promise<void> {
  await db
    .update(pyramidProjects)
    .set({ reactivatedAt: new Date(), updatedAt: new Date() })
    .where(eq(pyramidProjects.id, id));
}

export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const where = excludeId
    ? and(eq(pyramidProjects.slug, slug), ne(pyramidProjects.id, excludeId))
    : eq(pyramidProjects.slug, slug);
  const rows = await db.select({ id: pyramidProjects.id }).from(pyramidProjects).where(where).limit(1);
  return rows.length > 0;
}

export async function getCaptureMedia(mediaId: string) {
  const rows = await db
    .select()
    .from(pyramidProjectMedia)
    .where(eq(pyramidProjectMedia.id, mediaId))
    .limit(1);
  return rows[0] ?? null;
}

export async function getPendingCaptureMedia(projectId: string) {
  return db
    .select()
    .from(pyramidProjectMedia)
    .where(and(eq(pyramidProjectMedia.projectId, projectId), eq(pyramidProjectMedia.kind, 'capture')))
    .orderBy(asc(pyramidProjectMedia.displayOrder));
}

export async function markCaptureStarted(mediaId: string): Promise<void> {
  await db
    .update(pyramidProjectMedia)
    .set({ captureStatus: 'pending', captureError: null, updatedAt: new Date() })
    .where(eq(pyramidProjectMedia.id, mediaId));
}

export async function markCaptureSucceeded(
  mediaId: string,
  url: string,
  provider: string,
): Promise<void> {
  await db
    .update(pyramidProjectMedia)
    .set({
      url,
      provider,
      captureStatus: 'succeeded',
      capturedAt: new Date(),
      captureError: null,
      updatedAt: new Date(),
    })
    .where(eq(pyramidProjectMedia.id, mediaId));
}

export async function markCaptureFailed(mediaId: string, error: string): Promise<void> {
  await db
    .update(pyramidProjectMedia)
    .set({ captureStatus: 'failed', captureError: error.slice(0, 500), updatedAt: new Date() })
    .where(eq(pyramidProjectMedia.id, mediaId));
}

export async function getReferencedMediaPaths(): Promise<string[]> {
  const rows = await db
    .select({ url: pyramidProjectMedia.url, posterUrl: pyramidProjectMedia.posterUrl })
    .from(pyramidProjectMedia);
  const sections = await db
    .select({ payload: pyramidProjectSections.payload })
    .from(pyramidProjectSections);

  const urls: string[] = [];
  for (const row of rows) {
    if (row.url) urls.push(row.url);
    if (row.posterUrl) urls.push(row.posterUrl);
  }
  for (const section of sections) {
    collectUrls(section.payload, urls);
  }
  return urls;
}

function collectUrls(value: unknown, into: string[]): void {
  if (typeof value === 'string') {
    if (value.startsWith('http')) into.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectUrls(item, into);
    return;
  }
  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) collectUrls(item, into);
  }
}
