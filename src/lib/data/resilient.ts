import { withDbRetry } from '@/lib/db/retry';

export async function resilient<T>(label: string, work: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await withDbRetry(work);
  } catch (error) {
    console.error(`[resilient:${label}] serving fallback —`, error);
    return fallback;
  }
}
