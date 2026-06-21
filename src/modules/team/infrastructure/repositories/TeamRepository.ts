import { or, isNull, gt, asc, sql, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { pyramidTeam, type PyramidTeamRow } from '../models/PyramidTeam';
import type { ITeamRepository } from '../interfaces/ITeamRepository';
import type { CreateTeamMemberDTO, UpdateTeamMemberDTO } from '../../application/dtos/TeamMemberDTO';

const activeFilter = or(isNull(pyramidTeam.deactivatedAt), gt(pyramidTeam.reactivatedAt, pyramidTeam.deactivatedAt));

export class TeamRepository implements ITeamRepository {
  async getActiveMembers(): Promise<PyramidTeamRow[]> {
    return db.select().from(pyramidTeam).where(activeFilter).orderBy(asc(pyramidTeam.displayOrder));
  }

  async getActiveCount(): Promise<number> {
    const result = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(pyramidTeam)
      .where(activeFilter);
    return result[0]?.total ?? 0;
  }

  async getAllMembers(): Promise<PyramidTeamRow[]> {
    return db.select().from(pyramidTeam).orderBy(asc(pyramidTeam.displayOrder));
  }

  async findById(id: string): Promise<PyramidTeamRow | null> {
    const rows = await db.select().from(pyramidTeam).where(eq(pyramidTeam.id, id)).limit(1);
    return rows[0] ?? null;
  }

  async create(data: CreateTeamMemberDTO & { password: string }): Promise<PyramidTeamRow> {
    const rows = await db
      .insert(pyramidTeam)
      .values({
        name: data.name,
        jobTitle: data.jobTitle,
        description: data.description ?? null,
        email: data.email,
        linkedinUrl: data.linkedinUrl ?? null,
        avatarUrl: data.avatarUrl ?? null,
        password: data.password,
        displayOrder: data.displayOrder ?? 0,
      })
      .returning();
    return rows[0];
  }

  async update(id: string, data: UpdateTeamMemberDTO & { password?: string }): Promise<PyramidTeamRow | null> {
    const rows = await db
      .update(pyramidTeam)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(pyramidTeam.id, id))
      .returning();
    return rows[0] ?? null;
  }

  async deactivate(id: string): Promise<void> {
    await db
      .update(pyramidTeam)
      .set({ deactivatedAt: new Date(), updatedAt: new Date() })
      .where(eq(pyramidTeam.id, id));
  }

  async reactivate(id: string): Promise<void> {
    await db
      .update(pyramidTeam)
      .set({ reactivatedAt: new Date(), updatedAt: new Date() })
      .where(eq(pyramidTeam.id, id));
  }
}
