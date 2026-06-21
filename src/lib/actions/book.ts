'use server';

import { revalidatePath } from 'next/cache';

import { bookRequestSchema } from '@/lib/validations/book';
import { createBookRequest, DuplicateRequestError } from '@/lib/data/book';
import { logger } from '@/lib/logger';
import type { BookRequestDTO } from '@/types/book';

export type BookSubmitResult = { ok: true } | { ok: false; duplicate?: boolean };

export async function submitBookingAction(data: BookRequestDTO): Promise<BookSubmitResult> {
  const parsed = bookRequestSchema.safeParse(data);
  if (!parsed.success) return { ok: false };

  try {
    await createBookRequest(parsed.data);
    revalidatePath('/dashboard');
    return { ok: true };
  } catch (e) {
    if (e instanceof DuplicateRequestError) return { ok: false, duplicate: true };
    logger.error('book-request: submit failed', { error: String(e) });
    return { ok: false };
  }
}
