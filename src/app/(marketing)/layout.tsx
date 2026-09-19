import Navigation from '@/components/navigation';
import { WhatsAppButton, WhatsAppProvider } from '@/components/marketing/whatsapp';
import { visibleNavItems } from '@/lib/constants';
import { getNavCounts } from '@/lib/data/nav';

export const maxDuration = 30;

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { hasTeam, projectCount } = await getNavCounts();

  return (
    <WhatsAppProvider>
      <Navigation items={visibleNavItems({ team: hasTeam, projects: projectCount > 0 })} />
      {children}
      <WhatsAppButton />
    </WhatsAppProvider>
  );
}
