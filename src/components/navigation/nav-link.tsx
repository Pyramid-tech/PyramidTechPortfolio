'use client';

import { motion } from 'framer-motion';
import { slide, scale } from '@/lib/animations';

import { FC } from 'react';

import { cn } from '@/lib/utils';

interface Props {
  data: { title: string; route: string; index: number };
  isActive: boolean;
  isCurrent?: boolean;
  setSelectedIndicator: (href: string | null) => void;
  handleClick: () => void;
}

const NavLink: FC<Props> = ({ data, isActive, isCurrent, setSelectedIndicator, handleClick }) => {
  const { title, route, index } = data;

  return (
    <motion.div
      className="relative flex items-center"
      onMouseEnter={() => setSelectedIndicator(route)}
      custom={index}
      variants={slide}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <motion.div
        className="absolute left-0 inline-block h-2 w-2 rounded-full bg-white"
        variants={scale}
        animate={isActive ? 'open' : 'closed'}
      ></motion.div>
      <button
        type="button"
        onClick={handleClick}
        aria-current={isCurrent ? 'page' : undefined}
        className={cn(
          'cursor-pointer text-left text-2xl font-semibold leading-snug tracking-wide transition duration-200 hover:translate-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:text-3xl',
          isCurrent && 'text-white',
        )}
      >
        {title}
      </button>
    </motion.div>
  );
};
export default NavLink;
