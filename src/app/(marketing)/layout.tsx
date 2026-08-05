import Navigation from '@/components/navigation';
import { visibleNavItems } from '@/lib/constants';
import { getActiveTeamCount } from '@/lib/data/team';
import { getActiveProjectCount } from '@/lib/data/project';

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [{ hasTeam }, projectCount] = await Promise.all([
    getActiveTeamCount(),
    getActiveProjectCount(),
  ]);

  return (
    <>
      <Navigation items={visibleNavItems({ team: hasTeam, projects: projectCount > 0 })} />
      {children}
    </>
  );
}
