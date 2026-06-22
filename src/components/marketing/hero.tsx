'use client';
import { useRef } from 'react';
import Image from 'next/image';

import Button from '@/components/ui/button';
import useFloatingImages from '@/hooks/use-floating-images';

import { useScroll, useTransform, motion } from 'framer-motion';

const Hero = () => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  const { manageMouseMove } = useFloatingImages(ref1, ref2, ref3);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
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
        onMouseMove={(e) => manageMouseMove(e)}
        className="relative left-0 top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden md:h-[80vh]"
      >
        <motion.h1
          ref={heading1}
          className="relative z-20 mt-[-5vw] w-full max-w-[95%] text-center text-[4.5vw] font-extrabold text-text-1 md:text-[6vw] md:leading-[1.2]"
          style={{ opacity }}
        >
          CREATING UNIQUENESS
        </motion.h1>
        <motion.h2
          ref={heading2}
          className="text-text-1/7 5 z-20 text-[1.7vw] font-medium md:text-[3vw]"
          style={{ opacity }}
        >
          Creative team based in Lebanon
        </motion.h2>
        <motion.div className="z-20" style={{ opacity }}>
          <Button
            onClick={scrollToAbout}
            title="LEARN MORE"
            classes="px-[1.8vw] w-[22vw] md:w-[32vw] min-h-[4vw] md:min-h-[7vw] text-[1.25vw] md:text-[2.25vw] bg-bg-1 hover:bg-bg-1/80"
            btnClasses="mt-[2vw]"
          />
        </motion.div>
        <div ref={ref1} className={`absolute left-0 top-0 z-10 h-full w-full`}>
          <Image src="/images/hero/frame-1.svg" fill={true} alt="" className="" objectFit="cover" />
        </div>

        <div ref={ref2} className={`absolute left-0 top-0 h-full w-full `}>
          <Image src="/images/hero/frame-2.svg" fill={true} alt="" objectFit="cover" />
        </div>

        <div ref={ref3} className={`absolute left-0 top-0 h-full w-full `}>
          <Image src="/images/hero/frame-3.svg" fill={true} alt="" objectFit="cover" />
        </div>
      </div>
    </section>
  );
};
export default Hero;
