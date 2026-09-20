import crypto from 'crypto';
import { and, count, desc, sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { pyramidRequests } from '@/lib/db/schema/book';
import { getActiveTeamMembers } from '@/lib/data/team';
import { sendProjectConfirmationEmail, sendProjectRequestEmail } from '@/lib/email';
import { logger } from '@/lib/logger';
import type { BookRequestDTO, PyramidRequestDTO } from '@/types/book';

/** Thrown when an identical request was already submitted. */
export class DuplicateRequestError extends Error {
  constructor() {
    super('Your request was already received — we will be in touch soon.');
    this.name = 'DuplicateRequestError';
  }
}

const CONFIRMATIONS_PER_24H = 3;

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

  const inserted = await db
    .insert(pyramidRequests)
    .values({
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
    })
    .onConflictDoNothing({ target: pyramidRequests.contentHash })
    .returning({ id: pyramidRequests.id });

  if (inserted.length === 0) {
    logger.warning('book-request: duplicate blocked', { hash });
    throw new DuplicateRequestError();
  }

  const bookRequestId = inserted[0].id;
  const [team, visitor] = await Promise.allSettled([
    notifyTeam(bookRequestId, dto),
    confirmVisitor(bookRequestId, dto),
  ]);

  if (team.status === 'rejected') {
    logger.error('book-request: notification failed', {
      bookRequestId,
      error: String(team.reason),
    });
  }
  if (visitor.status === 'rejected') {
    logger.error('book-request: confirmation failed', {
      bookRequestId,
      error: String(visitor.reason),
    });
  }
}

async function notifyTeam(bookRequestId: string, dto: BookRequestDTO): Promise<void> {
  const members = await getActiveTeamMembers();
  const emails = members.map((m) => m.email).filter(Boolean);

  if (emails.length === 0) {
    logger.warning('book-request: no active members to notify', { bookRequestId });
    return;
  }

  await sendProjectRequestEmail(emails, dto);
  logger.info('book-request: sent', { bookRequestId, to: emails, from: dto.email });
}

async function confirmVisitor(bookRequestId: string, dto: BookRequestDTO): Promise<void> {
  const recent = await countRequestsInLast24h(dto.email);

  if (recent > CONFIRMATIONS_PER_24H) {
    logger.warning('book-request: confirmation skipped, 24h limit reached', {
      bookRequestId,
      to: dto.email,
      recent,
    });
    return;
  }

  await sendProjectConfirmationEmail(dto.email, dto);
  logger.info('book-request: confirmation sent', { bookRequestId, to: dto.email });
}

async function countRequestsInLast24h(email: string): Promise<number> {
  const [row] = await db
    .select({ total: count() })
    .from(pyramidRequests)
    .where(
      and(
        sql`lower(${pyramidRequests.email}) = ${email.trim().toLowerCase()}`,
        sql`${pyramidRequests.createdAt} > now() - interval '24 hours'`,
      ),
    );
  return row?.total ?? 0;
}
