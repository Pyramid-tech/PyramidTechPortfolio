import { z } from 'zod';

import {
  PROJECT_ORIGINS,
  PROJECT_LIFECYCLES,
  PROJECT_AVAILABILITIES,
  PROJECT_PLATFORMS,
  PROJECT_SERVICES,
  MEDIA_KINDS,
  ACTION_KINDS,
} from '@/types/project';

export const EMBED_PROVIDERS = ['youtube', 'vimeo', 'loom', 'figma'] as const;

const EMBED_HOSTS: Record<(typeof EMBED_PROVIDERS)[number], string[]> = {
  youtube: ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com'],
  vimeo: ['player.vimeo.com', 'vimeo.com'],
  loom: ['www.loom.com', 'loom.com'],
  figma: ['www.figma.com', 'figma.com', 'embed.figma.com'],
};

export function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function isMailto(value: string): boolean {
  try {
    return new URL(value).protocol === 'mailto:';
  } catch {
    return false;
  }
}

export function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const trimmedText = (max: number) => z.string().trim().min(1).max(max);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((v) => (v ? v : null));

const httpsUrl = z.string().trim().refine(isHttpsUrl, 'Must be an https:// URL');

const actionUrl = z
  .string()
  .trim()
  .refine((v) => isHttpsUrl(v) || isMailto(v), 'Must be an https:// or mailto: URL');

const optionalHttpsUrl = z
  .string()
  .trim()
  .nullish()
  .transform((v) => (v ? v : null))
  .refine((v) => v === null || isHttpsUrl(v), 'Must be an https:// URL');

const paragraphs = z.array(z.string().trim().min(1)).min(1).max(40);

const mediaRefSchema = z.object({
  url: httpsUrl,
  altText: optionalText(300),
  caption: optionalText(300).optional(),
});

export const sectionPayloadSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('rich-text'), paragraphs }),
  z.object({ type: z.literal('full-media'), media: mediaRefSchema }),
  z.object({
    type: z.literal('split'),
    paragraphs,
    media: mediaRefSchema,
    mediaSide: z.enum(['left', 'right']),
  }),
  z.object({ type: z.literal('gallery'), items: z.array(mediaRefSchema).min(1).max(24) }),
  z.object({
    type: z.literal('video'),
    url: httpsUrl,
    posterUrl: httpsUrl,
    altText: optionalText(300),
  }),
  z.object({
    type: z.literal('features'),
    items: z
      .array(z.object({ title: trimmedText(160), description: optionalText(500).optional() }))
      .min(1)
      .max(24),
  }),
  z.object({
    type: z.literal('metrics'),
    items: z
      .array(z.object({ value: trimmedText(40), label: trimmedText(160) }))
      .min(1)
      .max(12),
  }),
  z.object({
    type: z.literal('quote'),
    quote: trimmedText(1000),
    attribution: optionalText(160).optional(),
    role: optionalText(160).optional(),
  }),
  z.object({ type: z.literal('tech'), items: z.array(trimmedText(60)).min(1).max(40) }),
  z.object({ type: z.literal('diagram'), media: mediaRefSchema }),
  z
    .object({
      type: z.literal('embed'),
      provider: z.enum(EMBED_PROVIDERS),
      url: httpsUrl,
      title: trimmedText(160),
    })
    .refine(
      (v) => {
        try {
          return EMBED_HOSTS[v.provider].includes(new URL(v.url).hostname);
        } catch {
          return false;
        }
      },
      { message: 'Embed URL does not match the selected provider', path: ['url'] },
    ),
]);

export const mediaInputSchema = z
  .object({
    id: z.uuid().optional(),
    kind: z.enum(MEDIA_KINDS),
    url: optionalHttpsUrl,
    posterUrl: optionalHttpsUrl,
    sourceUrl: optionalHttpsUrl,
    provider: optionalText(60),
    altText: optionalText(300),
    caption: optionalText(300),
    platform: z.enum(PROJECT_PLATFORMS).nullish().default(null),
    isFeatured: z.boolean(),
    displayOrder: z.number().int().min(0),
  })
  .superRefine((media, ctx) => {
    const needsUrl = media.kind !== 'capture' && media.kind !== 'embed';
    if (needsUrl && !media.url) {
      ctx.addIssue({ code: 'custom', path: ['url'], message: 'An asset URL is required' });
    }
    if (media.kind === 'capture' && !media.sourceUrl) {
      ctx.addIssue({
        code: 'custom',
        path: ['sourceUrl'],
        message: 'A capture source URL is required',
      });
    }
    if (media.kind === 'embed' && !media.sourceUrl) {
      ctx.addIssue({ code: 'custom', path: ['sourceUrl'], message: 'An embed URL is required' });
    }
    if ((media.kind === 'video' || media.kind === 'animation') && !media.posterUrl) {
      ctx.addIssue({ code: 'custom', path: ['posterUrl'], message: 'A poster image is required' });
    }
    if (media.url && !media.altText) {
      ctx.addIssue({ code: 'custom', path: ['altText'], message: 'Alternative text is required' });
    }
  });

export const actionInputSchema = z.object({
  id: z.uuid().optional(),
  kind: z.enum(ACTION_KINDS),
  label: trimmedText(80),
  url: actionUrl,
  isPrimary: z.boolean(),
  displayOrder: z.number().int().min(0),
});

export const sectionInputSchema = z.object({
  id: z.uuid().optional(),
  heading: optionalText(200),
  displayOrder: z.number().int().min(0),
  payload: sectionPayloadSchema,
});

export const projectInputSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .min(1)
      .max(160)
      .transform(normalizeSlug)
      .refine((v) => v.length > 0, 'Slug must contain letters or numbers'),
    title: trimmedText(200),
    summary: trimmedText(400),
    overview: trimmedText(4000),
    origin: z.enum(PROJECT_ORIGINS),
    lifecycle: z.enum(PROJECT_LIFECYCLES),
    availability: z.enum(PROJECT_AVAILABILITIES),
    client: optionalText(200),
    industry: optionalText(120),
    timeframe: optionalText(120),
    platforms: z.array(z.enum(PROJECT_PLATFORMS)).min(1, 'Select at least one platform'),
    services: z.array(z.enum(PROJECT_SERVICES)).min(1, 'Select at least one service'),
    featured: z.boolean(),
    displayOrder: z.number().int(),
    media: z.array(mediaInputSchema).max(40),
    actions: z.array(actionInputSchema).max(10),
    sections: z.array(sectionInputSchema).max(30),
  })
  .superRefine((project, ctx) => {
    if (project.media.filter((m) => m.isFeatured).length > 1) {
      ctx.addIssue({
        code: 'custom',
        path: ['media'],
        message: 'Only one asset can be the featured visual',
      });
    }
    if (project.actions.filter((a) => a.isPrimary).length > 1) {
      ctx.addIssue({
        code: 'custom',
        path: ['actions'],
        message: 'Only one action can be primary',
      });
    }
  });

export const createProjectSchema = projectInputSchema;
export const updateProjectSchema = projectInputSchema;
