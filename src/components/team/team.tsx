import { FC } from 'react';

import type { TeamMemberDTO } from '@/types/team';
import SectionTitle from '@/components/ui/section-title';

import TeamMemberCard from './team-member-card';

interface Props {
  members: TeamMemberDTO[];
}

const Team: FC<Props> = ({ members }) => {
  return (
    <div className="mx-auto max-w-6xl px-6 md:px-12">
      <header className="mb-12 sm:mb-16">
        <SectionTitle as="h1" title="TEAM." />
        <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-text-2 md:text-lg">
          The engineers and designers who build the work. Small on purpose, so the people who scope your
          project are the people who ship it.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
        {members.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

export default Team;
