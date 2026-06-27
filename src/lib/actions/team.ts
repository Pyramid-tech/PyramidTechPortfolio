'use server';

import { revalidatePath } from 'next/cache';

import { requireUser } from '@/lib/auth';
import { createMemberSchema, updateMemberSchema } from '@/lib/validations/team';
import {
  createTeamMember,
  updateTeamMember,
  deactivateTeamMember,
  reactivateTeamMember,
  approveTeamMember,
  rejectTeamMember,
  getApproverId,
} from '@/lib/data/team';
import { validateMember } from '@/lib/ai/validate-member';
import { groqConfig } from '@/lib/ai/config';
import type {
  CreateTeamMemberDTO,
  UpdateTeamMemberDTO,
  MemberContent,
  MemberGateOutcome,
  MemberMutationResult,
} from '@/types/team';

export type ActionResult = { ok: true } | { ok: false; error: string };

function revalidate(): void {
  revalidatePath('/dashboard');
  revalidatePath('/team');
  revalidatePath('/'); // home "Meet the team" CTA depends on the team count
}

/**
 * Run the Groq confidence gate and map it to persisted fields. Shared by create
 * and update so the rule is identical: score ≥ threshold → auto-approved;
 * score < threshold OR AI unavailable → pending (held for the owner's approval).
 */
async function runGate(
  content: MemberContent,
  avatarUrl: string | null | undefined,
): Promise<MemberGateOutcome> {
  const verdict = await validateMember(content, avatarUrl);
  const approved =
    verdict.available &&
    verdict.confidence !== null &&
    verdict.confidence >= groqConfig.confidenceThreshold;
  return {
    approvalStatus: approved ? 'approved' : 'pending',
    confidenceScore: verdict.confidence,
    aiReason: verdict.reason,
    aiModel: verdict.model,
    approvedAt: approved ? new Date() : null,
  };
}

/** Authorize the caller as the sole approver (earliest-created member). */
async function requireApprover(): Promise<
  { ok: true; userId: string } | { ok: false; error: string }
> {
  const user = await requireUser();
  const approverId = await getApproverId();
  if (!approverId || user.id !== approverId) {
    return { ok: false, error: 'Only the owner can approve or reject members' };
  }
  return { ok: true, userId: user.id };
}

export async function createTeamMemberAction(
  data: CreateTeamMemberDTO,
): Promise<MemberMutationResult> {
  await requireUser();
  const parsed = createMemberSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: 'Invalid data' };

  const outcome = await runGate(parsed.data, parsed.data.avatarUrl);
  try {
    await createTeamMember(parsed.data, outcome);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Create failed' };
  }
  revalidate();
  return {
    ok: true,
    status: outcome.approvalStatus === 'approved' ? 'approved' : 'pending',
    confidence: outcome.confidenceScore,
    reason: outcome.aiReason,
  };
}

export async function updateTeamMemberAction(
  id: string,
  data: UpdateTeamMemberDTO,
): Promise<MemberMutationResult> {
  await requireUser();
  const parsed = updateMemberSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: 'Invalid data' };

  // Re-validate on every save; a low score or AI outage demotes a live member.
  const content: MemberContent = {
    name: parsed.data.name ?? '',
    jobTitle: parsed.data.jobTitle ?? '',
    description: parsed.data.description,
    linkedinUrl: parsed.data.linkedinUrl,
  };
  const outcome = await runGate(content, parsed.data.avatarUrl);
  try {
    await updateTeamMember(id, parsed.data, outcome);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Update failed' };
  }
  revalidate();
  return {
    ok: true,
    status: outcome.approvalStatus === 'approved' ? 'approved' : 'pending',
    confidence: outcome.confidenceScore,
    reason: outcome.aiReason,
  };
}

export async function approveTeamMemberAction(id: string): Promise<ActionResult> {
  const gate = await requireApprover();
  if (!gate.ok) return gate;
  await approveTeamMember(id, gate.userId);
  revalidate();
  return { ok: true };
}

export async function rejectTeamMemberAction(id: string): Promise<ActionResult> {
  const gate = await requireApprover();
  if (!gate.ok) return gate;
  await rejectTeamMember(id);
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
