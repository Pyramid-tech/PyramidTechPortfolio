import { FC } from 'react';

import type { TeamMemberDTO } from '@/types/team';

interface Props {
  members: TeamMemberDTO[];
}

const Index: FC<Props> = ({ members }) => {
  return (
    <div className="mx-auto max-w-[80vw] px-[4vw] md:max-w-[90vw]">
      <div className="mb-[4vw]">
        <h1 className="text-center text-[3.5vw] font-bold leading-[100%] md:text-[4.6vw]">Our Team</h1>
        <p className="mt-[1vw] text-center text-[1.3vw] text-gray-400 md:text-[2vw]">The people behind Pyramid.</p>
      </div>

      <div className="grid grid-cols-5 gap-[2vw] md:grid-cols-2 md:gap-[5vw]">
        {members.map((member) => (
          <div key={member.id} className="flex flex-col gap-[1vw] md:gap-[2vw]">
            <div className="h-[16vw] w-full overflow-hidden rounded-[0.5vw] bg-gradient-to-b from-stone-700 to-stone-900 md:h-[38vw]">
              {member.avatarUrl && (
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="h-full w-full object-cover transition hover:brightness-110"
                />
              )}
            </div>

            <div className="flex flex-col gap-[0.4vw] md:gap-[1vw]">
              <p className="text-[1.3vw] font-semibold leading-tight md:text-[2.8vw]">{member.name}</p>
              <p className="text-[1vw] text-primary md:text-[2vw]">{member.jobTitle}</p>
              {member.description && (
                <p className="mt-[0.2vw] text-[0.9vw] leading-[1.5] text-gray-400 md:text-[1.8vw]">
                  {member.description}
                </p>
              )}
            </div>

            <div className="mt-auto flex items-center gap-[0.8vw] md:gap-[2vw]">
              {member.linkedinUrl && (
                <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg
                    className="h-[1.2vw] w-[1.2vw] fill-gray-400 transition hover:fill-white md:h-[2.5vw] md:w-[2.5vw]"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              )}
              <a href={`mailto:${member.email}`} aria-label="Email">
                <svg
                  className="h-[1.2vw] w-[1.2vw] fill-gray-400 transition hover:fill-white md:h-[2.5vw] md:w-[2.5vw]"
                  viewBox="0 0 24 24"
                >
                  <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
