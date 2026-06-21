'use server';

import { revalidatePath } from 'next/cache';

import { requireUser } from '@/lib/auth';
import { createMemberSchema, updateMemberSchema } from '@/lib/validations/team';
import {
  createTeamMember,
  updateTeamMember,
  deactivateTeamMember,
  reactivateTeamMember,
} from '@/lib/data/team';
import type { CreateTeamMemberDTO, UpdateTeamMemberDTO } from '@/types/team';

export type ActionResult = { ok: true } | { ok: false; error: string };

function revalidate(): void {
  revalidatePath('/dashboard');
  revalidatePath('/team');
  revalidatePath('/'); // home "Meet the team" CTA depends on the team count
}

export async function createTeamMemberAction(data: CreateTeamMemberDTO): Promise<ActionResult> {
  await requireUser();
  const parsed = createMemberSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: 'Invalid data' };

  await createTeamMember(parsed.data);
  revalidate();
  return { ok: true };
}

export async function updateTeamMemberAction(
  id: string,
  data: UpdateTeamMemberDTO,
): Promise<ActionResult> {
  await requireUser();
  const parsed = updateMemberSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: 'Invalid data' };

  try {
    await updateTeamMember(id, parsed.data);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Update failed' };
  }
  revalidate();
  return { ok: true };
}

export async function deactivateTeamMemberAction(id: string): Promise<ActionResult> {
  await requireUser();
  await deactivateTeamMember(id);
  revalidate();
  return { ok: true };
}

export async function reactivateTeamMemberAction(id: string): Promise<ActionResult> {
  await requireUser();
  await reactivateTeamMember(id);
  revalidate();
  return { ok: true };
}
