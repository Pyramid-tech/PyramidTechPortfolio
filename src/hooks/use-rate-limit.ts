'use client';

interface UseRateLimitOptions {
  key: string;
  max: number;
  windowMs: number;
}

interface UseRateLimitResult {
  allowed: () => boolean;
  record: () => void;
}

export function useRateLimit({ key, max, windowMs }: UseRateLimitOptions): UseRateLimitResult {
  const getTimestamps = (): number[] => {
    try {
      return JSON.parse(sessionStorage.getItem(key) ?? '[]');
    } catch {
      return [];
    }
  };

  const allowed = (): boolean => {
    const now = Date.now();
    const recent = getTimestamps().filter((t) => now - t < windowMs);
    return recent.length < max;
  };

  const record = (): void => {
    const now = Date.now();
    const recent = getTimestamps().filter((t) => now - t < windowMs);
    sessionStorage.setItem(key, JSON.stringify([...recent, now]));
  };

  return { allowed, record };
}
