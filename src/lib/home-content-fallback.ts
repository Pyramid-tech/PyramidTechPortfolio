import type { HomeContent } from '@/types/home-content';

export const HOME_CONTENT_FALLBACK = {
  hero: {
    title: 'We build AI products that ship',
    subtitle: 'Agents, RAG pipelines and full-stack web and mobile, out of Beirut.',
    ctaLabel: 'See the work',
  },
  about: {
    sectionTitle: 'ABOUT.',
    ctaLabel: 'Meet the team',
  },
  services: {
    sectionTitle: 'SERVICES.',
  },
  work: {
    sectionTitle: 'WORK.',
    ctaLabel: 'See all work',
  },
  approach: {
    sectionTitle: 'APPROACH.',
  },
  cta: {
    heading: "LET'S CONNECT",
    ctaLabel: 'Start a project',
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
    hero: { ...HOME_CONTENT_FALLBACK.hero, ...filled(content.hero) },
    about: { ...HOME_CONTENT_FALLBACK.about, ...filled(content.about) },
    services: { ...HOME_CONTENT_FALLBACK.services, ...filled(content.services) },
    work: { ...HOME_CONTENT_FALLBACK.work, ...filled(content.work) },
    approach: { ...HOME_CONTENT_FALLBACK.approach, ...filled(content.approach) },
    cta: { ...HOME_CONTENT_FALLBACK.cta, ...filled(content.cta) },
  };
}
