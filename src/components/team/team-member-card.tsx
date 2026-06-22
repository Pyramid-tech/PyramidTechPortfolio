import { FC } from 'react';

import type { TeamMemberDTO } from '@/types/team';

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');

const TeamMemberCard: FC<{ member: TeamMemberDTO }> = ({ member }) => (
  <div className="group flex w-full flex-col gap-3">
    <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-stroke/40 bg-gradient-to-b from-stone-700 to-stone-900">
      {member.avatarUrl ? (
        <img
          src={member.avatarUrl}
          alt={member.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-110"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-3xl font-semibold tracking-wide text-text-1/25">
          {getInitials(member.name)}
        </div>
      )}
    </div>

    <div className="flex flex-col gap-1">
      <p className="text-base font-semibold leading-tight">{member.name}</p>
      <p className="text-sm text-primary">{member.jobTitle}</p>
      {member.description && (
        <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-gray-400">{member.description}</p>
      )}
    </div>

    <div className="mt-auto flex items-center gap-3 pt-1">
      {member.linkedinUrl && (
        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on LinkedIn`}
        >
          <svg className="h-5 w-5 fill-gray-400 transition hover:fill-white" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </a>
      )}
      <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`}>
        <svg className="h-5 w-5 fill-gray-400 transition hover:fill-white" viewBox="0 0 24 24">
          <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" />
        </svg>
      </a>
    </div>
  </div>
);

export default TeamMemberCard;
