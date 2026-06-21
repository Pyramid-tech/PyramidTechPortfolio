import bcrypt from 'bcryptjs';

import type { ITeamRepository } from '../../infrastructure/interfaces/ITeamRepository';
import type { ITeamService } from '../interfaces/ITeamService';
import type {
  TeamMemberDTO,
  AdminTeamMemberDTO,
  CreateTeamMemberDTO,
  UpdateTeamMemberDTO,
} from '../dtos/TeamMemberDTO';
import type { ILogger } from '@/shared/logger/interfaces/ILogger';
import type { PyramidTeamRow } from '../../infrastructure/models/PyramidTeam';
import { HttpError } from '@/shared/errors/HttpError';

function isActive(row: PyramidTeamRow): boolean {
  if (!row.deactivatedAt) return true;
  if (row.reactivatedAt && row.reactivatedAt > row.deactivatedAt) return true;
  return false;
}

function toAdminDTO(row: PyramidTeamRow): AdminTeamMemberDTO {
  return {
    id: row.id,
    name: row.name,
    jobTitle: row.jobTitle,
    description: row.description,
    email: row.email,
    linkedinUrl: row.linkedinUrl,
    avatarUrl: row.avatarUrl,
    displayOrder: row.displayOrder ?? 0,
    deactivatedAt: row.deactivatedAt,
    reactivatedAt: row.reactivatedAt,
    createdAt: row.createdAt,
    isActive: isActive(row),
  };
}

export class TeamService implements ITeamService {
  constructor(
    private readonly teamRepository: ITeamRepository,
    private readonly logger: ILogger,
  ) {}

  async getActiveCount(): Promise<{ count: number; hasTeam: boolean }> {
    const count = await this.teamRepository.getActiveCount();
    this.logger.debug('Team count fetched', { count });
    return { count, hasTeam: count > 0 };
  }

  async getActiveMembers(): Promise<TeamMemberDTO[]> {
    const rows = await this.teamRepository.getActiveMembers();
    this.logger.info('Team members fetched', { count: rows.length });

    // password is intentionally excluded
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      jobTitle: row.jobTitle,
      description: row.description,
      email: row.email,
      linkedinUrl: row.linkedinUrl,
      avatarUrl: row.avatarUrl,
      displayOrder: row.displayOrder ?? 0,
    }));
  }

  async getAllMembers(): Promise<AdminTeamMemberDTO[]> {
    const rows = await this.teamRepository.getAllMembers();
    this.logger.info('Admin: all members fetched', { count: rows.length });
    return rows.map(toAdminDTO);
  }

  async createMember(data: CreateTeamMemberDTO): Promise<AdminTeamMemberDTO> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const row = await this.teamRepository.create({ ...data, password: hashedPassword });
    this.logger.info('Admin: member created', { email: data.email });
    return toAdminDTO(row);
  }

  async updateMember(id: string, data: UpdateTeamMemberDTO): Promise<AdminTeamMemberDTO> {
    const updateData: UpdateTeamMemberDTO & { password?: string } = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    const row = await this.teamRepository.update(id, updateData);
    if (!row) throw new HttpError(404, 'Member not found');
    this.logger.info('Admin: member updated', { id });
    return toAdminDTO(row);
  }

  async deactivateMember(id: string): Promise<void> {
    await this.teamRepository.deactivate(id);
    this.logger.info('Admin: member deactivated', { id });
  }

  async reactivateMember(id: string): Promise<void> {
    await this.teamRepository.reactivate(id);
    this.logger.info('Admin: member reactivated', { id });
  }
}
