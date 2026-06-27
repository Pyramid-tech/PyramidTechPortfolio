'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';

import SectionTitle from '@/components/ui/section-title';
import SectionOpacity from '@/components/ui/section-opacity';
import Button from '@/components/ui/button';

interface Props {
  hasTeam?: boolean;
}

const About: FC<Props> = ({ hasTeam = false }) => {
  const router = useRouter();

  return (
    <section id="about" className="z-0 border-t border-gray-1 bg-gradient-to-b py-16 md:py-24">
      <SectionOpacity classes="z-2">
        <SectionTitle title="ABOUT." classes="px-6 pt-8 z-10 md:px-12" />
        <div className="relative self-start px-6 pb-12 pt-8 md:px-12">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
            <div className="flex w-full flex-col items-center gap-6 md:grow-[4] md:basis-0 md:items-start">
              <p className="text-balance text-center text-base leading-relaxed md:text-left md:text-2xl lg:text-3xl">
                We are a young, close-knit team of like-minded people ready to help brands from USA prosper in the
                digital world.
              </p>
              {hasTeam && (
                <Button
                  onClick={() => router.push('/team')}
                  title="MEET THE TEAM"
                  classes="bg-bg-1 hover:bg-bg-1/80"
                  btnClasses="w-fit"
                />
              )}
            </div>

            <div className="relative aspect-[3/2] w-full max-w-md bg-bg-2 md:aspect-auto md:h-72 md:max-w-none md:grow-[3] md:basis-0">
              <img
                src="/images/hands_v2.jpg"
                alt="hands image"
                className="absolute inset-0 h-full w-full rounded object-cover transition hover:brightness-110"
              />
            </div>
          </div>
        </div>
      </SectionOpacity>
    </section>
  );
};
export default About;
