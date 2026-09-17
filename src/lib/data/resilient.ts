import { isRetryableDbError } from '@/lib/db/retry';

const DEFAULT_DEADLINE_MS = Number(process.env.DB_DEADLINE_MS) || 8000;
const MAX_ATTEMPTS = 2;

export async function withDeadline<T>(work: Promise<T>, ms = DEFAULT_DEADLINE_MS): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      work,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`database deadline exceeded after ${ms}ms`)), ms);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

export async function resilient<T>(
  label: string,
  work: () => Promise<T>,
  fallback: T,
  ms = DEFAULT_DEADLINE_MS,
): Promise<T> {
  const expiresAt = Date.now() + ms;
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const remaining = expiresAt - Date.now();
    if (remaining <= 0) break;

    try {
      return await withDeadline(work(), remaining);
    } catch (error) {
      lastError = error;
      if (!isRetryableDbError(error)) break;
    }
  }

  console.error(`[resilient:${label}] serving fallback —`, lastError);
  return fallback;
}
