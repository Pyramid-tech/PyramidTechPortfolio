import type { PyramidTeamRow } from '@/modules/team/infrastructure/models/PyramidTeam';

export interface IAuthRepository {
  findByEmail(email: string): Promise<PyramidTeamRow | null>;
}
