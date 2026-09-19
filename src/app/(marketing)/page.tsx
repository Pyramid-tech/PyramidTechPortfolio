import type { Metadata } from 'next';

import { Home as HomeContent } from '@/components/marketing';
import { getHomeContent } from '@/lib/data/home-content';
import { getCachedFeaturedProjects } from '@/lib/data/project-cached';
import { getNavCounts } from '@/lib/data/nav';
import { resilient } from '@/lib/data/resilient';

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  const [{ hasTeam }, content, featuredProjects] = await Promise.all([
    getNavCounts(),
    getHomeContent(),
    resilient('home:featured-projects', () => getCachedFeaturedProjects(6), []),
  ]);

  return (
    <HomeContent
      hasTeam={hasTeam}
      content={content}
      featuredProjects={featuredProjects}
    />
  );
}
