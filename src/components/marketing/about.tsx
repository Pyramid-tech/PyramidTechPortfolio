'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';

import SectionTitle from '@/components/ui/section-title';
import SectionOpacity from '@/components/ui/section-opacity';
import Button from '@/components/ui/button';
import AboutPyramid from '@/components/marketing/about-pyramid';

import type { HomeContent } from '@/types/home-content';

interface Props {
  content: HomeContent['about'];
  hasTeam?: boolean;
}

const About: FC<Props> = ({ content, hasTeam = false }) => {
  const router = useRouter();

  return (
    <section id="about" className="border-t border-gray-1 py-16 md:py-24">
      <SectionOpacity>
        <div className="px-6 md:px-12">
          <SectionTitle title={content?.sectionTitle ?? ''} />

          <div className="mt-10 flex flex-col items-start gap-8 md:mt-14 md:flex-row md:gap-12">
            <div className="flex w-full flex-col items-start gap-6 md:grow-[4] md:basis-0">
              <p className="max-w-[34ch] text-balance text-xl leading-relaxed md:text-2xl lg:text-3xl">
                {content?.paragraph}
              </p>
              {hasTeam && (
                <Button
                  onClick={() => router.push('/team')}
                  title={content?.ctaLabel ?? ''}
                  classes="bg-bg-1 hover:bg-bg-1/80"
                  btnClasses="w-fit"
                />
              )}
            </div>

            <AboutPyramid />
          </div>
        </div>
      </SectionOpacity>
    </section>
  );
};
export default About;
