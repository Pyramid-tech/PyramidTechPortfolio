const MAX_CAUSE_DEPTH = 5;

const TRANSIENT_CODES = new Set(['ECONNRESET', 'ECONNREFUSED', 'EPIPE', 'ETIMEDOUT', '57P01', '57014']);

const TRANSIENT_MESSAGES = [
  'Connection terminated',
  'timeout exceeded when trying to connect',
  'Query read timeout',
];

export class DbDeadlineError extends Error {
  constructor(ms: number) {
    super(`database deadline exceeded after ${ms}ms`);
    this.name = 'DbDeadlineError';
  }
}

export interface PgErrorInfo {
  code: string;
  constraint?: string;
}

function causeChain(error: unknown): Record<string, unknown>[] {
  const chain: Record<string, unknown>[] = [];
  let current: unknown = error;
  while (current != null && typeof current === 'object' && chain.length < MAX_CAUSE_DEPTH) {
    chain.push(current as Record<string, unknown>);
    current = (current as { cause?: unknown }).cause;
  }
  return chain;
}

function isQueryWrapper(error: Record<string, unknown>): boolean {
  return typeof error.query === 'string';
}

export function pgErrorOf(error: unknown): PgErrorInfo | null {
  for (const current of causeChain(error)) {
    if (typeof current.code !== 'string') continue;
    return {
      code: current.code,
      constraint: typeof current.constraint === 'string' ? current.constraint : undefined,
    };
  }
  return null;
}

export function isTransientDbError(error: unknown): boolean {
  for (const current of causeChain(error)) {
    if (current instanceof DbDeadlineError) return true;

    const { code, message } = current;
    if (typeof code === 'string' && (TRANSIENT_CODES.has(code) || code.startsWith('08'))) {
      return true;
    }
    if (
      !isQueryWrapper(current) &&
      typeof message === 'string' &&
      TRANSIENT_MESSAGES.some((fragment) => message.includes(fragment))
    ) {
      return true;
    }
  }
  return false;
}
