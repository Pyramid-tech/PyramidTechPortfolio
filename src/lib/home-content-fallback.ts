import type { HomeContent } from '@/types/home-content';

export const HOME_CONTENT_FALLBACK = {
  work: {
    sectionTitle: 'WORK.',
    ctaLabel: 'See all work',
  },
} satisfies HomeContent;

function filled<T extends object>(value: T | null | undefined): Partial<T> {
  if (!value) return {};

  const entries = Object.entries(value).filter(
    ([, field]) => field != null && !(typeof field === 'string' && field.trim() === ''),
  );
  return Object.fromEntries(entries) as Partial<T>;
}

export function withHomeContentFallback(content: HomeContent): HomeContent {
  return {
    ...content,
    work: { ...HOME_CONTENT_FALLBACK.work, ...filled(content.work) },
  };
}
