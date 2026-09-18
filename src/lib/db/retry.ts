const RETRYABLE_CODES = new Set([
  'CONNECTION_CLOSED',
  'CONNECTION_DESTROYED',
  'CONNECTION_ENDED',
  'CONNECT_TIMEOUT',
  'ECONNRESET',
  'EPIPE',
  'ETIMEDOUT',
]);

const DEFAULT_ATTEMPTS = 2;
const BACKOFF_MS = 100;

const MAX_CAUSE_DEPTH = 5;

export function isRetryableDbError(error: unknown): boolean {
  let current: unknown = error;

  for (let depth = 0; current != null && depth < MAX_CAUSE_DEPTH; depth += 1) {
    const code = (current as { code?: unknown }).code;
    if (typeof code === 'string' && RETRYABLE_CODES.has(code)) return true;
    current = (current as { cause?: unknown }).cause;
  }

  return false;
}

export async function withDbRetry<T>(
  work: () => Promise<T>,
  attempts = DEFAULT_ATTEMPTS,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await work();
    } catch (error) {
      lastError = error;
      if (attempt === attempts || !isRetryableDbError(error)) throw error;
      await new Promise((resolve) => setTimeout(resolve, BACKOFF_MS * attempt));
    }
  }

  throw lastError;
}
