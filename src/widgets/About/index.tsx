'use client';

import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import SectionTitle from '@/components/ui/SectionTitle';
import SectionOpacity from '@/components/ui/SectionOpacity';
import Button from '@/components/ui/Button';

interface Props {}

const Index: FC<Props> = () => {
  const router = useRouter();
  const [hasTeam, setHasTeam] = useState(false);

  useEffect(() => {
    fetch('/api/team/count')
      .then((res) => res.json())
      .then((data) => setHasTeam(data.hasTeam))
      .catch(() => setHasTeam(false));
  }, []);

  return (
    <section id="about" className="z-0 border-t border-gray-1 bg-gradient-to-b py-[6vw] md:py-[4vw]">
      <SectionOpacity classes="z-2">
        <SectionTitle title="ABOUT." classes="px-[6vw] md:px-[3vw] pt-[3vw] z-10" />
        <div className="relative self-start px-[6vw] pb-[5vw] pt-[3vw] md:px-[3vw]">
          <div className="flex space-x-[5vw] md:flex-col md:items-center md:space-x-0 md:space-y-[3vw]">
            <div className="flex grow-[4] basis-0 flex-col gap-[2vw] md:items-center">
              <p className="flex-wrap text-[2.3vw] md:text-balance md:text-center md:text-[3.8vw] md:leading-[1.3]">
                We are a young, close-knit team of like-minded people ready to help brands from USA prosper in the
                digital world.
              </p>
              {hasTeam && (
                <Button
                  onClick={() => router.push('/team')}
                  title="MEET THE TEAM"
                  classes="px-[1.8vw] py-[1vw] min-h-[4vw] md:min-h-[8vw] text-[1.25vw] md:text-[2.25vw] bg-bg-1 hover:bg-bg-1/80"
                  btnClasses="w-fit"
                />
              )}
            </div>

            <div className="relative h-[20vw] w-[30vw] grow-[3] basis-0 bg-bg-2 md:h-[40vw] md:w-full md:max-w-[90%] md:basis-[initial]  md:text-center">
              <img
                src="/images/hands_v2.jpg"
                alt="hands image"
                className="absolute inset-0 inline-block h-full w-full rounded-[0.125vw] transition hover:brightness-110 md:rounded-[0.25vw] md:object-cover"
              />
              ;
            </div>
          </div>
        </div>
      </SectionOpacity>
    </section>
  );
};
export default Index;
