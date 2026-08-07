import Navigation from '@/components/navigation';
import { visibleNavItems } from '@/lib/constants';
import { getNavCounts } from '@/lib/data/nav';

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { hasTeam, projectCount } = await getNavCounts();

  return (
    <>
      <Navigation items={visibleNavItems({ team: hasTeam, projects: projectCount > 0 })} />
      {children}
    </>
  );
}
