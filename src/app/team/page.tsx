'use client';

import { useEffect, useState } from 'react';

import Navigation from '@/widgets/Navigation';
import Team from '@/widgets/Team';
import TeamSkeleton from '@/widgets/Team/Skeleton';
import Footer from '@/widgets/Footer';
import type { TeamMemberDTO } from '@/modules/team/application/dtos/TeamMemberDTO';

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMemberDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/team')
      .then((res) => res.json())
      .then(setMembers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navigation />
      <section className="min-h-screen w-full bg-bg-1 py-[8vw]">
        {loading ? <TeamSkeleton count={5} /> : <Team members={members} />}
      </section>
      <Footer />
    </>
  );
}
