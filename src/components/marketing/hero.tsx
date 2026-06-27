'use client';
import { useRef } from 'react';
import Image from 'next/image';

import Button from '@/components/ui/button';
import useFloatingImages from '@/hooks/use-floating-images';
import { useIsCoarsePointer } from '@/hooks/use-media-query';

import { useLenis } from 'lenis/react';
import { useScroll, useTransform, motion } from 'framer-motion';

const Hero = () => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  const lenis = useLenis();
  const isCoarsePointer = useIsCoarsePointer();
  const { manageMouseMove } = useFloatingImages(ref1, ref2, ref3);

  const scrollToAbout = () => {
    lenis?.scrollTo('#about', { duration: 1.1 });
  };

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
        className="relative left-0 top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden"
      >
        <motion.h1
          ref={heading1}
          className="relative z-20 -mt-6 w-full px-4 text-center font-display text-4xl font-extrabold leading-tight text-text-1 sm:text-6xl md:-mt-10 md:text-7xl lg:text-8xl"
          style={{ opacity }}
        >
          CREATING UNIQUENESS
        </motion.h1>
        <motion.h2
          ref={heading2}
          className="z-20 font-display text-base font-medium text-text-1/75 sm:text-lg md:text-2xl"
          style={{ opacity }}
        >
          Creative team based in Lebanon
        </motion.h2>
        <motion.div className="z-20" style={{ opacity }}>
          <Button
            onClick={scrollToAbout}
            title="LEARN MORE"
            classes="bg-bg-1 hover:bg-bg-1/80"
            btnClasses="mt-6"
          />
        </motion.div>
        {/* Landscape (wide) viewports: layered, mouse-parallax frames (wide art) */}
        <div ref={ref1} className="pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-full landscape:block">
          <Image src="/images/hero/frame-1.svg" fill={true} alt="" className="object-cover" />
        </div>

        <div ref={ref2} className="pointer-events-none absolute left-0 top-0 hidden h-full w-full landscape:block">
          <Image src="/images/hero/frame-2.svg" fill={true} alt="" className="object-cover" />
        </div>

        <div ref={ref3} className="pointer-events-none absolute left-0 top-0 hidden h-full w-full landscape:block">
          <Image src="/images/hero/frame-3.svg" fill={true} alt="" className="object-cover" />
        </div>

        {/* Portrait viewports (phones, folds, portrait tablets): single portrait
            composition with smaller, scattered circles */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-full landscape:hidden">
          <Image src="/images/hero/frame-mobile.svg" fill={true} alt="" className="object-cover" />
        </div>
      </div>
    </section>
  );
};
export default Hero;
