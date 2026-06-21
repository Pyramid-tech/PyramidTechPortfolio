import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { pyramidTeam, type PyramidTeamRow } from '@/modules/team/infrastructure/models/PyramidTeam';
import type { IAuthRepository } from '../interfaces/IAuthRepository';

export class AuthRepository implements IAuthRepository {
  async findByEmail(email: string): Promise<PyramidTeamRow | null> {
    const rows = await db.select().from(pyramidTeam).where(eq(pyramidTeam.email, email)).limit(1);

    return rows[0] ?? null;
  }
}
