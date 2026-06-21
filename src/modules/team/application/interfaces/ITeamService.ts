import type {
  TeamMemberDTO,
  AdminTeamMemberDTO,
  CreateTeamMemberDTO,
  UpdateTeamMemberDTO,
} from '../dtos/TeamMemberDTO';

export interface ITeamService {
  // public
  getActiveMembers(): Promise<TeamMemberDTO[]>;
  getActiveCount(): Promise<{ count: number; hasTeam: boolean }>;
  // admin
  getAllMembers(): Promise<AdminTeamMemberDTO[]>;
  createMember(data: CreateTeamMemberDTO): Promise<AdminTeamMemberDTO>;
  updateMember(id: string, data: UpdateTeamMemberDTO): Promise<AdminTeamMemberDTO>;
  deactivateMember(id: string): Promise<void>;
  reactivateMember(id: string): Promise<void>;
}
