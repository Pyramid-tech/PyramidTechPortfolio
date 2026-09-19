import { cache } from 'react';
import { unstable_cache } from 'next/cache';

import { FEATURED_PROJECTS_TAG } from '@/lib/data/cache-tags';
import { getActiveProjectBySlug, getFeaturedProjects } from '@/lib/data/project';
import { withDbRetry } from '@/lib/db/retry';
import type { ProjectCardDTO } from '@/types/project';

export const getProjectForPage = cache((slug: string) =>
  withDbRetry(() => getActiveProjectBySlug(slug)),
);

export const getCachedFeaturedProjects = unstable_cache(
  async (limit = 6): Promise<ProjectCardDTO[]> => getFeaturedProjects(limit),
  ['featured-projects'],
  { revalidate: 300, tags: [FEATURED_PROJECTS_TAG] },
);
