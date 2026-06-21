import { z } from 'zod';

export const bookRequestSchema = z.object({
  service: z.string().min(1),
  budget: z.string().min(1),
  pages: z.string().min(1),
  quickness: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.email(),
  company: z.string().min(1),
  websiteUrl: z.string().optional(),
  message: z.string().optional(),
});
