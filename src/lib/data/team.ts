import { or, isNull, gt, asc, sql, eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

import { db } from '@/lib/db';
import { pyramidTeam, type PyramidTeamRow } from '@/lib/db/schema/team';
import type {
  TeamMemberDTO,
  AdminTeamMemberDTO,
  CreateTeamMemberDTO,
  UpdateTeamMemberDTO,
} from '@/types/team';

const activeFilter = or(
  isNull(pyramidTeam.deactivatedAt),
  gt(pyramidTeam.reactivatedAt, pyramidTeam.deactivatedAt),
);

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
  };
}

// ── Reads ──────────────────────────────────────────────────────────────
export async function getActiveTeamMembers(): Promise<TeamMemberDTO[]> {
  const rows = await db
    .select()
    .from(pyramidTeam)
    .where(activeFilter)
    .orderBy(asc(pyramidTeam.displayOrder));
  return rows.map(toPublicDTO);
}

export async function getActiveTeamCount(): Promise<{ count: number; hasTeam: boolean }> {
  const result = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(pyramidTeam)
    .where(activeFilter);
  const count = result[0]?.total ?? 0;
  return { count, hasTeam: count > 0 };
}

export async function getAdminTeamMembers(): Promise<AdminTeamMemberDTO[]> {
  const rows = await db.select().from(pyramidTeam).orderBy(asc(pyramidTeam.displayOrder));
  return rows.map(toAdminDTO);
}

// ── Writes ─────────────────────────────────────────────────────────────
export async function createTeamMember(data: CreateTeamMemberDTO): Promise<AdminTeamMemberDTO> {
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
    })
    .returning();
  return toAdminDTO(rows[0]);
}

export async function updateTeamMember(
  id: string,
  data: UpdateTeamMemberDTO,
): Promise<AdminTeamMemberDTO> {
  const patch: UpdateTeamMemberDTO & { password?: string } = { ...data };
  if (data.password) patch.password = await bcrypt.hash(data.password, 10);

  const rows = await db
    .update(pyramidTeam)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(pyramidTeam.id, id))
    .returning();

  const row = rows[0];
  if (!row) throw new Error('Member not found');
  return toAdminDTO(row);
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
