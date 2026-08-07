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
    <section id="contact">
      <SectionOpacity classes="flex flex-col">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-6 py-24 text-center md:py-32">
          <h3 className="font-display text-4xl font-medium md:text-7xl lg:text-8xl">{content?.heading}</h3>
          <p className="mt-3 text-base font-normal leading-relaxed text-text-1/75 md:text-xl">
            {content?.paragraph}
          </p>
          <Button
            onClick={handleFormToggle}
            title={content?.ctaLabel ?? ''}
            classes="bg-bg-1 hover:bg-bg-1/80"
            btnClasses="mt-6"
          />
        </div>

        <Footer />
      </SectionOpacity>
    </section>
  );
};
export default CallToAction;
