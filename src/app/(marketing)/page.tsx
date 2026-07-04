import { Home as HomeContent } from '@/components/marketing';
import { getActiveTeamCount } from '@/lib/data/team';
import { getHomeContent } from '@/lib/data/home-content';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [{ hasTeam }, content] = await Promise.all([getActiveTeamCount(), getHomeContent()]);

  return <HomeContent hasTeam={hasTeam} content={content} />;
}
