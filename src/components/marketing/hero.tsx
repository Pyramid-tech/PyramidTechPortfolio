'use client';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import { HeroFrameMobile, HeroFrameOne, HeroFrameThree, HeroFrameTwo } from './hero-frames';
import useFloatingImages from '@/hooks/use-floating-images';
import { useIsCoarsePointer } from '@/hooks/use-media-query';

import { useLenis } from 'lenis/react';
import { useScroll, useTransform, motion } from 'framer-motion';

import type { HomeContent } from '@/types/home-content';

interface Props {
  content: HomeContent['hero'];
}

function HeroTitle({ title }: { title: string }) {
  const match = title.match(/^(.*?)(\bShips\b)(.*)$/i);
  if (!match) return title;

  return (
    <>
      {match[1]}
      <span className="text-accent">{match[2]}</span>
      {match[3]}
    </>
  );
}

const Hero = ({ content }: Props) => {
  const router = useRouter();
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  const lenis = useLenis();
  const isCoarsePointer = useIsCoarsePointer();
  const { manageMouseMove } = useFloatingImages(ref1, ref2, ref3);

  const heading1 = useRef(null);
  const heading2 = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heading1,
    offset: ['start 0.35', 'end 0.1'],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section id="main" className="relative bg-gradient-to-b  ">
      <div
        onMouseMove={isCoarsePointer ? undefined : manageMouseMove}
        className="relative left-0 top-0 flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-6"
      >
        <motion.h1
          ref={heading1}
          className="relative z-raised mx-auto max-w-[18ch] text-balance text-center font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-text-1 sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ opacity }}
        >
          <HeroTitle title={content?.title ?? ''} />
        </motion.h1>
        <motion.p
          ref={heading2}
          className="z-raised mt-5 max-w-[46ch] text-balance text-center text-base font-medium text-text-2 sm:text-lg md:mt-6 md:text-xl"
          style={{ opacity }}
        >
          {content?.subtitle}
        </motion.p>
        <motion.div className="z-raised mt-8 flex flex-col items-center gap-3" style={{ opacity }}>
          <Button
            onClick={() => router.push('/book')}
            title={content?.ctaLabel ?? ''}
            classes="bg-bg-1 hover:bg-bg-1/80"
          />
          {content?.secondaryCtaLabel ? (
            <button
              type="button"
              onClick={() => lenis?.scrollTo('#work', { duration: 1.1 })}
              className="min-h-11 px-2 text-sm font-medium uppercase tracking-wide text-text-2 transition hover:text-text-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {content.secondaryCtaLabel}
            </button>
          ) : null}
        </motion.div>
        {/* Landscape (wide) viewports: layered, mouse-parallax frames (wide art) */}
        <div ref={ref1} className="pointer-events-none absolute left-0 top-0 z-0 hidden h-full w-full landscape:block">
          <HeroFrameOne />
        </div>

        <div ref={ref2} className="pointer-events-none absolute left-0 top-0 hidden h-full w-full landscape:block">
          <HeroFrameTwo />
        </div>

        <div ref={ref3} className="pointer-events-none absolute left-0 top-0 hidden h-full w-full landscape:block">
          <HeroFrameThree />
        </div>

        {/* Portrait viewports (phones, folds, portrait tablets): single portrait
            composition with smaller, scattered circles */}
        <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full landscape:hidden">
          <HeroFrameMobile />
        </div>
      </div>
    </section>
  );
};
export default Hero;
