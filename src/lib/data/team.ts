import { or, and, isNull, gt, asc, sql, eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

import { db } from '@/lib/db';
import { pyramidTeam, type PyramidTeamRow } from '@/lib/db/schema/team';
import type {
  TeamMemberDTO,
  AdminTeamMemberDTO,
  CreateTeamMemberDTO,
  UpdateTeamMemberDTO,
  ApprovalStatus,
  MemberGateOutcome,
} from '@/types/team';

const activeFilter = or(
  isNull(pyramidTeam.deactivatedAt),
  gt(pyramidTeam.reactivatedAt, pyramidTeam.deactivatedAt),
);

// Public visibility: active (not soft-deleted) AND approved by the AI gate /
// the owner. Pending and rejected members are hidden from the marketing site.
const publishedFilter = and(activeFilter, eq(pyramidTeam.approvalStatus, 'approved'));

function isActive(row: PyramidTeamRow): boolean {
  if (!row.deactivatedAt) return true;
  if (row.reactivatedAt && row.reactivatedAt > row.deactivatedAt) return true;
  return false;
}

/** Public projection — password intentionally excluded. */
function toPublicDTO(row: PyramidTeamRow): TeamMemberDTO {
  return {
    id: row.id,
    name: row.name,
    jobTitle: row.jobTitle,
    description: row.description,
    email: row.email,
    linkedinUrl: row.linkedinUrl,
    avatarUrl: row.avatarUrl,
    displayOrder: row.displayOrder ?? 0,
  };
}

function toAdminDTO(row: PyramidTeamRow): AdminTeamMemberDTO {
  return {
    ...toPublicDTO(row),
    deactivatedAt: row.deactivatedAt,
    reactivatedAt: row.reactivatedAt,
    createdAt: row.createdAt,
    isActive: isActive(row),
    approvalStatus: row.approvalStatus as ApprovalStatus,
    confidenceScore: row.confidenceScore,
    aiReason: row.aiReason,
    approvedAt: row.approvedAt,
  };
}

// ── Reads ──────────────────────────────────────────────────────────────
export async function getActiveTeamMembers(): Promise<TeamMemberDTO[]> {
  const rows = await db
    .select()
    .from(pyramidTeam)
    .where(publishedFilter)
    .orderBy(asc(pyramidTeam.displayOrder));
  return rows.map(toPublicDTO);
}

export async function getActiveTeamCount(): Promise<{ count: number; hasTeam: boolean }> {
  const result = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(pyramidTeam)
    .where(publishedFilter);
  const count = result[0]?.total ?? 0;
  return { count, hasTeam: count > 0 };
}

/**
 * The single member allowed to approve pending submissions: the earliest-created
 * member (the founder/owner). Returns `null` only when the table is empty.
 */
export async function getApproverId(): Promise<string | null> {
  const rows = await db
    .select({ id: pyramidTeam.id })
    .from(pyramidTeam)
    .orderBy(asc(pyramidTeam.createdAt))
    .limit(1);
  return rows[0]?.id ?? null;
}

export async function getAdminTeamMembers(): Promise<AdminTeamMemberDTO[]> {
  const rows = await db.select().from(pyramidTeam).orderBy(asc(pyramidTeam.displayOrder));
  return rows.map(toAdminDTO);
}

// ── Writes ─────────────────────────────────────────────────────────────
export async function createTeamMember(
  data: CreateTeamMemberDTO,
  outcome: MemberGateOutcome,
): Promise<AdminTeamMemberDTO> {
  const password = await bcrypt.hash(data.password, 10);
  const rows = await db
    .insert(pyramidTeam)
    .values({
      name: data.name,
      jobTitle: data.jobTitle,
      description: data.description ?? null,
      email: data.email,
      linkedinUrl: data.linkedinUrl ?? null,
      avatarUrl: data.avatarUrl ?? null,
      password,
      displayOrder: data.displayOrder ?? 0,
      approvalStatus: outcome.approvalStatus,
      confidenceScore: outcome.confidenceScore,
      aiReason: outcome.aiReason,
      aiModel: outcome.aiModel,
      approvedAt: outcome.approvedAt,
    })
    .returning();
  return toAdminDTO(rows[0]);
}

export async function updateTeamMember(
  id: string,
  data: UpdateTeamMemberDTO,
  outcome: MemberGateOutcome,
): Promise<AdminTeamMemberDTO> {
  const patch: UpdateTeamMemberDTO & { password?: string } = { ...data };
  if (data.password) patch.password = await bcrypt.hash(data.password, 10);

  const rows = await db
    .update(pyramidTeam)
    .set({
      ...patch,
      approvalStatus: outcome.approvalStatus,
      confidenceScore: outcome.confidenceScore,
      aiReason: outcome.aiReason,
      aiModel: outcome.aiModel,
      approvedAt: outcome.approvedAt,
      // Re-scoring supersedes any prior manual approval; clear the approver.
      approvedBy: null,
      updatedAt: new Date(),
    })
    .where(eq(pyramidTeam.id, id))
    .returning();

  const row = rows[0];
  if (!row) throw new Error('Member not found');
  return toAdminDTO(row);
}

export async function approveTeamMember(id: string, approverId: string): Promise<void> {
  await db
    .update(pyramidTeam)
    .set({
      approvalStatus: 'approved',
      approvedBy: approverId,
      approvedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(pyramidTeam.id, id));
}

export async function rejectTeamMember(id: string): Promise<void> {
  await db
    .update(pyramidTeam)
    .set({ approvalStatus: 'rejected', updatedAt: new Date() })
    .where(eq(pyramidTeam.id, id));
}

export async function deactivateTeamMember(id: string): Promise<void> {
  await db
    .update(pyramidTeam)
    .set({ deactivatedAt: new Date(), updatedAt: new Date() })
    .where(eq(pyramidTeam.id, id));
}

export async function reactivateTeamMember(id: string): Promise<void> {
  await db
    .update(pyramidTeam)
    .set({ reactivatedAt: new Date(), updatedAt: new Date() })
    .where(eq(pyramidTeam.id, id));
}
