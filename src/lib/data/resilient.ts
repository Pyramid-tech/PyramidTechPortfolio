const DEFAULT_DEADLINE_MS = 3000;

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
  try {
    return await withDeadline(work(), ms);
  } catch (error) {
    console.error(`[resilient:${label}] serving fallback —`, error);
    return fallback;
  }
}
