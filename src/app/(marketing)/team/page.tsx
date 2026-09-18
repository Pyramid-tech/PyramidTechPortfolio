import type { Metadata } from 'next';

import { Team } from '@/components/team';
import { Footer } from '@/components/marketing';
import { getActiveTeamMembers } from '@/lib/data/team';
import { withDbRetry } from '@/lib/db/retry';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Team',
  description: 'The engineers and designers behind Pyramid, based in Beirut.',
  alternates: { canonical: '/team' },
};

export default async function TeamPage() {
  const members = await withDbRetry(getActiveTeamMembers);

  return (
    <>
      <section className="min-h-screen w-full bg-bg-1 py-20 sm:py-24">
        <Team members={members} />
      </section>
      <Footer />
    </>
  );
}
