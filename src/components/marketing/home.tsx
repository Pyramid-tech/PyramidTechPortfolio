'use client';

import Navigation from '@/components/navigation';
import { ShadowCursor } from '@/components/ui/cursor';
import { useHashScroll } from '@/hooks/use-hash-scroll';

import type { HomeContent } from '@/types/home-content';

import Hero from './hero';
import About from './about';
import Services from './services';
import Approach from './approach';
import CallToAction from './call-to-action';

interface Props {
  hasTeam: boolean;
  content: HomeContent;
}

export default function Home({ hasTeam, content }: Props) {
  useHashScroll();

  return (
    <>
      <Navigation />
      <Hero content={content.hero} />
      <About content={content.about} hasTeam={hasTeam} />
      <Services content={content.services} />
      <Approach content={content.approach} />
      <CallToAction content={content.cta} />

      {/* disable cursor here */}
      <ShadowCursor />
    </>
  );
}
