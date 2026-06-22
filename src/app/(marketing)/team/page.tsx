import Navigation from '@/components/navigation';
import { Team } from '@/components/team';
import { Footer } from '@/components/marketing';
import { getActiveTeamMembers } from '@/lib/data/team';

export default async function TeamPage() {
  const members = await getActiveTeamMembers();

  return (
    <>
      <Navigation />
      <section className="min-h-screen w-full bg-bg-1 py-20 sm:py-24">
        <Team members={members} />
      </section>
      <Footer />
    </>
  );
}
