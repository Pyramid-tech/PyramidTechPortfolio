import Navigation from '@/components/sections/navigation';
import Team from '@/components/sections/team/team';
import Footer from '@/components/sections/footer';
import { getActiveTeamMembers } from '@/lib/data/team';

export default async function TeamPage() {
  const members = await getActiveTeamMembers();

  return (
    <>
      <Navigation />
      <section className="min-h-screen w-full bg-bg-1 py-[8vw]">
        <Team members={members} />
      </section>
      <Footer />
    </>
  );
}
