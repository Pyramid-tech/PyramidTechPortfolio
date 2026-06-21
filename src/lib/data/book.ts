import crypto from 'crypto';
import { eq, desc } from 'drizzle-orm';

import { db } from '@/lib/db';
import { pyramidRequests } from '@/lib/db/schema/book';
import { getActiveTeamMembers } from '@/lib/data/team';
import { sendProjectRequestEmail } from '@/lib/email';
import { logger } from '@/lib/logger';
import type { BookRequestDTO, PyramidRequestDTO } from '@/types/book';

/** Thrown when an identical request was already submitted. */
export class DuplicateRequestError extends Error {
  constructor() {
    super('Your request was already received — we will be in touch soon.');
    this.name = 'DuplicateRequestError';
  }
}

function buildHash(dto: BookRequestDTO): string {
  const content = [dto.service, dto.name, dto.email, dto.company, dto.message ?? ''].join('|');
  return crypto.createHash('sha256').update(content).digest('hex');
}

export async function getBookRequests(): Promise<PyramidRequestDTO[]> {
  const rows = await db.select().from(pyramidRequests).orderBy(desc(pyramidRequests.createdAt));
  return rows.map((r) => ({
    id: r.id,
    service: r.service,
    budget: r.budget,
    pages: r.pages,
    quickness: r.quickness,
    name: r.name,
    phone: r.phone,
    email: r.email,
    company: r.company,
    websiteUrl: r.websiteUrl,
    message: r.message,
    createdAt: r.createdAt ? r.createdAt.toISOString() : null,
  }));
}

export async function createBookRequest(dto: BookRequestDTO): Promise<void> {
  const hash = buildHash(dto);

  const existing = await db
    .select({ id: pyramidRequests.id })
    .from(pyramidRequests)
    .where(eq(pyramidRequests.contentHash, hash))
    .limit(1);
  if (existing.length > 0) {
    logger.warning('book-request: duplicate blocked', { hash });
    throw new DuplicateRequestError();
  }

  const members = await getActiveTeamMembers();
  const emails = members.map((m) => m.email).filter(Boolean);

  if (emails.length === 0) {
    logger.warning('book-request: no active members to notify');
  } else {
    await sendProjectRequestEmail(emails, dto);
    logger.info('book-request: sent', { to: emails, from: dto.email });
  }

  await db.insert(pyramidRequests).values({
    service: dto.service,
    budget: dto.budget,
    pages: dto.pages,
    quickness: dto.quickness,
    name: dto.name,
    phone: dto.phone,
    email: dto.email,
    company: dto.company,
    websiteUrl: dto.websiteUrl ?? null,
    message: dto.message ?? null,
    contentHash: hash,
  });
}
