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

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface AdminTeamMemberDTO extends TeamMemberDTO {
  deactivatedAt: Date | null;
  reactivatedAt: Date | null;
  createdAt: Date | null;
  isActive: boolean;
  approvalStatus: ApprovalStatus;
  confidenceScore: number | null;
  aiReason: string | null;
  approvedAt: Date | null;
}

/** The fields the AI validation reasons over (text side; avatar passed separately). */
export interface MemberContent {
  name: string;
  jobTitle: string;
  description?: string | null;
  linkedinUrl?: string | null;
}

/**
 * Raw verdict from the Groq validation call. `available` is `false` on ANY AI
 * failure (down, timeout, non-2xx, unparseable) — callers must then hold the
 * member for approval rather than auto-publish.
 */
export interface MemberVerdict {
  available: boolean;
  confidence: number | null;
  reason: string | null;
  model: string | null;
}

/**
 * The gate decision derived from a {@link MemberVerdict} + threshold, ready to
 * persist. Shared by the create and update data functions.
 */
export interface MemberGateOutcome {
  approvalStatus: ApprovalStatus;
  confidenceScore: number | null;
  aiReason: string | null;
  aiModel: string | null;
  approvedAt: Date | null;
}

/**
 * Result returned by the add/edit Server Actions — carries the AI verdict so the
 * form can tell the admin whether the member was published or held for approval.
 */
export type MemberMutationResult =
  | { ok: true; status: 'approved' | 'pending'; confidence: number | null; reason: string | null }
  | { ok: false; error: string };

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
