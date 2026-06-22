import { FC } from 'react';

import type { TeamMemberDTO } from '@/types/team';

import TeamMemberCard from './team-member-card';

interface Props {
  members: TeamMemberDTO[];
}

const Team: FC<Props> = ({ members }) => {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mb-12 text-center sm:mb-16">
        <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Our Team</h1>
        <p className="mt-2 text-sm text-gray-400 sm:text-base">The people behind Pyramid.</p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,200px))] justify-center gap-x-8 gap-y-12">
        {members.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

export default Team;
