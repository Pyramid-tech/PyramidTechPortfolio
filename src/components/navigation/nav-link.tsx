'use client';

import { motion } from 'framer-motion';
import { slide, scale } from '@/lib/animations';

import { FC } from 'react';

interface Props {
  data: { title: string; href: string; index: number };
  isActive: boolean;
  setSelectedIndicator: (href: string | null) => void;
  handleClick: () => void;
}

const NavLink: FC<Props> = ({ data, isActive, setSelectedIndicator, handleClick }) => {
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
        className="absolute left-0 inline-block h-2 w-2 rounded-full bg-white"
        variants={scale}
        animate={isActive ? 'open' : 'closed'}
      ></motion.div>
      <div
        tabIndex={0}
        className="cursor-pointer text-2xl font-semibold leading-snug tracking-wide transition duration-200 hover:translate-x-2 md:text-3xl"
      >
        {title}
      </div>
    </motion.div>
  );
};
export default NavLink;
