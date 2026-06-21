/**
 * Shared shapes for the Team domain — used by server code (data fns, Server
 * Actions, RSC) and by client components that render or submit them.
 *
 * Import these from either side. Client code must NOT import server-only
 * modules (db, actions, data); it depends on these neutral types instead.
 */

export interface TeamMemberDTO {
  id: string;
  name: string;
  jobTitle: string;
  description: string | null;
  email: string;
  linkedinUrl: string | null;
  avatarUrl: string | null;
  displayOrder: number;
}

export interface AdminTeamMemberDTO extends TeamMemberDTO {
  deactivatedAt: Date | null;
  reactivatedAt: Date | null;
  createdAt: Date | null;
  isActive: boolean;
}

export interface CreateTeamMemberDTO {
  name: string;
  jobTitle: string;
  description?: string | null;
  email: string;
  linkedinUrl?: string | null;
  avatarUrl?: string | null;
  password: string;
  displayOrder?: number;
}

export interface UpdateTeamMemberDTO {
  name?: string;
  jobTitle?: string;
  description?: string | null;
  linkedinUrl?: string | null;
  avatarUrl?: string | null;
  password?: string;
  displayOrder?: number;
}
