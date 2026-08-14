'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/button';
import SectionOpacity from '@/components/ui/section-opacity';

import Footer from './footer';

import type { HomeContent } from '@/types/home-content';

interface Props {
  content: HomeContent['cta'];
}

const CallToAction: FC<Props> = ({ content }) => {
  const router = useRouter();

  const handleFormToggle = () => {
    router.push('/book');
  };

  return (
    <section id="contact" className="border-t border-gray-1">
      <SectionOpacity classes="flex flex-col" offset={['start 0.55', 'start 0.95']}>
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-24 text-center md:py-32">
          <h2 className="text-balance font-display text-4xl font-extrabold leading-none tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {content?.heading}
          </h2>
          <p className="mt-5 max-w-[52ch] text-balance text-base leading-relaxed text-text-2 md:text-lg">
            {content?.paragraph}
          </p>
          <Button
            onClick={handleFormToggle}
            title={content?.ctaLabel ?? ''}
            classes="bg-bg-1 hover:bg-bg-1/80"
            btnClasses="mt-8"
          />
        </div>

        <Footer />
      </SectionOpacity>
    </section>
  );
};
export default CallToAction;
