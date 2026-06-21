'use client';

import { motion } from 'framer-motion';
import { slide, scale } from '@/lib/animations';

import { FC } from 'react';

interface Props {
  data: any;
  isActive: boolean;
  setSelectedIndicator: any;
  handleClick: () => void;
}

const Index: FC<Props> = ({ data, isActive, setSelectedIndicator, handleClick }) => {
  const { title, href, index } = data;

  return (
    <motion.div
      className="relative flex items-center"
      onMouseEnter={() => setSelectedIndicator(href)}
      custom={index}
      variants={slide}
      initial="initial"
      animate="enter"
      exit="exit"
      onClick={handleClick}
    >
      <motion.div
        className="absolute left-0 inline-block h-[0.6vw] w-[0.6vw] rounded-full bg-white"
        variants={scale}
        animate={isActive ? 'open' : 'closed'}
      ></motion.div>
      <div
        tabIndex={0}
        className="cursor-pointer text-[2.5vw] font-semibold leading-[1.35] tracking-wide transition-[cubic-bezier(.16,1,.3,1)] duration-200 hover:translate-x-[1.6vw]  md:text-[3vw] md:leading-[1.25]"
      >
        {title}
      </div>
    </motion.div>
  );
};
export default Index;
