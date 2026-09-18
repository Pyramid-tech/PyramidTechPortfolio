'use client';

import { ShadowCursor } from '@/components/ui/cursor';
import { useHashScroll } from '@/hooks/use-hash-scroll';

import type { HomeContent } from '@/types/home-content';
import type { ProjectCardDTO } from '@/types/project';

import Hero from './hero';
import About from './about';
import Services from './services';
import SelectedWork from './selected-work';
import Approach from './approach';
import CallToAction from './call-to-action';

interface Props {
  hasTeam: boolean;
  content: HomeContent;
  featuredProjects: ProjectCardDTO[];
}

export default function Home({ hasTeam, content, featuredProjects }: Props) {
  useHashScroll();

  return (
    <>
      <Hero content={content.hero} />
      <Services content={content.services} />
      <SelectedWork content={content.work} projects={featuredProjects} />
      <About content={content.about} hasTeam={hasTeam} />
      <Approach content={content.approach} />
      <CallToAction content={content.cta} />

      {/* disable cursor here */}
      <ShadowCursor />
    </>
  );
}
