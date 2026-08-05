import type { MetadataRoute } from 'next';

import { getActiveProjectSlugs } from '@/lib/data/project';

export const dynamic = 'force-dynamic';

function baseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pyramid.dev').replace(/\/$/, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = baseUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/work`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/team`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/book`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
  ];

  try {
    const projects = await getActiveProjectSlugs();
    return [
      ...staticRoutes,
      ...projects.map((project) => ({
        url: `${base}/work/${project.slug}`,
        lastModified: project.updatedAt ?? now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
