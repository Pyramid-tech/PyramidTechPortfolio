import type { PyramidTeamRow } from '../models/PyramidTeam';
import type { CreateTeamMemberDTO, UpdateTeamMemberDTO } from '../../application/dtos/TeamMemberDTO';

export interface ITeamRepository {
  // public
  getActiveMembers(): Promise<PyramidTeamRow[]>;
  getActiveCount(): Promise<number>;
  // admin
  getAllMembers(): Promise<PyramidTeamRow[]>;
  findById(id: string): Promise<PyramidTeamRow | null>;
  create(data: CreateTeamMemberDTO & { password: string }): Promise<PyramidTeamRow>;
  update(id: string, data: UpdateTeamMemberDTO & { password?: string }): Promise<PyramidTeamRow | null>;
  deactivate(id: string): Promise<void>;
  reactivate(id: string): Promise<void>;
}
