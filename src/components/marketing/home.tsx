'use client';

import Navigation from '@/components/navigation';
import { ShadowCursor } from '@/components/ui/cursor';
import { useHashScroll } from '@/hooks/use-hash-scroll';

import Hero from './hero';
import About from './about';
import Services from './services';
import Approach from './approach';
import CallToAction from './call-to-action';

interface Props {
  hasTeam: boolean;
}

export default function Home({ hasTeam }: Props) {
  useHashScroll();

  return (
    <>
      <Navigation />
      <Hero />
      <About hasTeam={hasTeam} />
      <Services />
      <Approach />
      <CallToAction />

      {/* disable cursor here */}
      <ShadowCursor />
    </>
  );
}
