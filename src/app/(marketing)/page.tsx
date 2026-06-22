import { Home as HomeContent } from '@/components/marketing';
import { getActiveTeamCount } from '@/lib/data/team';

export default async function HomePage() {
  const { hasTeam } = await getActiveTeamCount();

  return <HomeContent hasTeam={hasTeam} />;
}
