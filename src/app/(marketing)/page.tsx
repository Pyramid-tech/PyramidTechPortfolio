import { Home as HomeContent } from '@/components/marketing';
import { getActiveTeamCount } from '@/lib/data/team';
import { getHomeContent } from '@/lib/data/home-content';
import { getFeaturedProjects, getActiveProjectCount } from '@/lib/data/project';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [{ hasTeam }, content, featuredProjects, projectCount] = await Promise.all([
    getActiveTeamCount(),
    getHomeContent(),
    getFeaturedProjects(6),
    getActiveProjectCount(),
  ]);

  return (
    <HomeContent
      hasTeam={hasTeam}
      content={content}
      featuredProjects={featuredProjects}
      projectCount={projectCount}
    />
  );
}
