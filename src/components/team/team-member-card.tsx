import { FC } from 'react';

import type { TeamMemberDTO } from '@/types/team';
import { LinkedInIcon } from '../icons';

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');

const socialLink =
  'flex h-11 w-11 items-center justify-center rounded-full text-text-2 transition hover:bg-bg-2 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

const TeamMemberCard: FC<{ member: TeamMemberDTO }> = ({ member }) => (
  <div className="group flex w-full flex-col gap-3">
    <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-stroke/40 bg-gradient-to-b from-bg-3 to-bg-2">
      {member.avatarUrl ? (
        <img
          src={member.avatarUrl}
          alt={member.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-110"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-display text-3xl font-semibold tracking-wide text-text-2">
          {getInitials(member.name)}
        </div>
      )}
    </div>

    <div className="flex flex-col gap-1">
      <p className="text-base font-semibold leading-tight">{member.name}</p>
      <p className="text-sm text-primary">{member.jobTitle}</p>
      {member.description && (
        <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-text-2">
          {member.description}
        </p>
      )}
    </div>

    <div className="mt-auto flex items-center gap-1 pt-1">
      {member.linkedinUrl && (
        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on LinkedIn`}
          className={socialLink}
        >
          <LinkedInIcon className="h-5 w-5" />
        </a>
      )}
      <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`} className={socialLink}>
        <svg aria-hidden className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" />
        </svg>
      </a>
    </div>
  </div>
);

export default TeamMemberCard;
