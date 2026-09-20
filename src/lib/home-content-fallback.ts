import type { HomeContent } from '@/types/home-content';

export const HOME_CONTENT_FALLBACK = {
  hero: {
    title: 'We Build Software that Ships',
    subtitle: 'Custom web apps, mobile apps, desktop software, and AI.',
    ctaLabel: 'Start a project',
    secondaryCtaLabel: 'See the work',
  },
  about: {
    sectionTitle: 'ABOUT.',
    paragraph:
      'Pyramid is a Beirut software studio. We design and build web applications, mobile apps, and desktop products for companies that need something custom, not a template. The same people who scope the work are the people who ship it.',
    ctaLabel: 'Meet the team',
  },
  services: {
    sectionTitle: 'SERVICES.',
    cards: [
      {
        title: 'Web development',
        description:
          'Sites, web applications, CMS platforms, APIs, and shops, built end to end for the way you actually work.',
        tags: ['Web apps', 'CMS', 'APIs', 'E-commerce'],
      },
      {
        title: 'Mobile development',
        description:
          'Native and cross-platform apps for iOS and Android, from first screen to store release.',
        tags: ['iOS', 'Android', 'Cross-platform'],
      },
      {
        title: 'Desktop development',
        description:
          'Windows, macOS, and Linux applications when the work needs to live on a desktop, not in a browser.',
        tags: ['Windows', 'macOS', 'Linux'],
      },
      {
        title: 'AI',
        description:
          'Agents, chatbots, and automation that sit inside the products we build: useful features, not a science project.',
        tags: ['Agents', 'Chatbots', 'Automation'],
      },
    ],
  },
  work: {
    sectionTitle: 'WORK.',
    intro: 'Shipped products across web and mobile, and we take desktop work the same way.',
    ctaLabel: 'See all work',
  },
  approach: {
    sectionTitle: 'APPROACH.',
    intro: 'Five steps from first conversation to a product in production.',
    cards: [
      {
        title: 'Consultation',
        description:
          'Goals, users, and constraints: whether this is web, mobile, desktop, or a mix.',
      },
      {
        title: 'Scope & design',
        description:
          'Screens, architecture, and a plan you can react to before we write production code.',
      },
      {
        title: 'Build',
        description: 'Implementation with you in the loop, on the platforms you need.',
      },
      {
        title: 'Test',
        description: 'Functionality, performance, and real-device checks before launch.',
      },
      {
        title: 'Launch & support',
        description:
          'Production deploy, handoff, and the monitoring or iteration you want after go-live.',
      },
    ],
  },
  cta: {
    heading: "LET'S CONNECT",
    paragraph:
      'Tell us what you need on web, mobile, or desktop. We reply within two working days with a first take on scope, timeline, and cost.',
    ctaLabel: 'Start a project',
  },
} satisfies HomeContent;

/** Live CMS still has the old branding-studio hero. Treat it as unset until Studio is republished. */
const STALE_HERO_TITLES = new Set(['CREATING UNIQUENESS', 'WE BUILD AI PRODUCTS THAT SHIP']);

function filled<T extends object>(value: T | null | undefined): Partial<T> {
  if (!value) return {};

  const entries = Object.entries(value).filter(([, field]) => {
    if (field == null) return false;
    if (typeof field === 'string') return field.trim() !== '';
    if (Array.isArray(field)) return field.length > 0;
    return true;
  });
  return Object.fromEntries(entries) as Partial<T>;
}

export function withHomeContentFallback(content: HomeContent): HomeContent {
  const heroTitle = content.hero?.title?.trim().toUpperCase() ?? '';
  const source = STALE_HERO_TITLES.has(heroTitle) ? {} : content;

  return {
    ...source,
    hero: { ...HOME_CONTENT_FALLBACK.hero, ...filled(source.hero) },
    about: { ...HOME_CONTENT_FALLBACK.about, ...filled(source.about) },
    services: { ...HOME_CONTENT_FALLBACK.services, ...filled(source.services) },
    work: { ...HOME_CONTENT_FALLBACK.work, ...filled(source.work) },
    approach: { ...HOME_CONTENT_FALLBACK.approach, ...filled(source.approach) },
    cta: { ...HOME_CONTENT_FALLBACK.cta, ...filled(source.cta) },
  };
}
