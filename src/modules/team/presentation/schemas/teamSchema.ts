import { z } from 'zod';

export const teamMemberSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  jobTitle: z.string().min(1),
  description: z.string().nullable(),
  email: z.email(),
  linkedinUrl: z.url().nullable(),
  avatarUrl: z.url().nullable(),
  displayOrder: z.number().int(),
});

export const teamMembersResponseSchema = z.array(teamMemberSchema);

export const createMemberSchema = z.object({
  name: z.string().min(1),
  jobTitle: z.string().min(1),
  description: z.string().nullable().optional(),
  email: z.email(),
  linkedinUrl: z.url().nullable().optional(),
  avatarUrl: z.url().nullable().optional(),
  password: z.string().min(6),
  displayOrder: z.number().int().optional(),
});

export const updateMemberSchema = z.object({
  name: z.string().min(1).optional(),
  jobTitle: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  linkedinUrl: z.url().nullable().optional(),
  avatarUrl: z.url().nullable().optional(),
  password: z.string().min(6).optional(),
  displayOrder: z.number().int().optional(),
});
