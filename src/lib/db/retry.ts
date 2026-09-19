import { DbDeadlineError, isTransientDbError } from '@/lib/db/errors';

const DEFAULT_ATTEMPTS = 2;
const DEFAULT_DEADLINE_MS = Number(process.env.DB_DEADLINE_MS) || 10_000;
const BACKOFF_MS = 100;

export interface DbRetryOptions {
  attempts?: number;
  deadlineMs?: number;
}

export async function withDeadline<T>(work: Promise<T>, ms = DEFAULT_DEADLINE_MS): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      work,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new DbDeadlineError(ms)), ms);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

export async function withDbRetry<T>(
  work: () => Promise<T>,
  { attempts = DEFAULT_ATTEMPTS, deadlineMs = DEFAULT_DEADLINE_MS }: DbRetryOptions = {},
): Promise<T> {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await withDeadline(work(), deadlineMs);
    } catch (error) {
      if (attempt >= attempts || !isTransientDbError(error)) throw error;
      await new Promise((resolve) => setTimeout(resolve, BACKOFF_MS * attempt));
    }
  }
}
