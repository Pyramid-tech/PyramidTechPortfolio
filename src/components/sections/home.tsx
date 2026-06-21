'use client';

import Navigation from '@/components/sections/navigation';
import Hero from '@/components/sections/hero/hero';
import About from '@/components/sections/about';
import Services from '@/components/sections/services';
import Approach from '@/components/sections/approach';
import CallToAction from '@/components/sections/call-to-action';
import ShadowCursor from '@/components/ui/shadow-cursor/shadow-cursor';

interface Props {
  hasTeam: boolean;
}

export default function Home({ hasTeam }: Props) {
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
