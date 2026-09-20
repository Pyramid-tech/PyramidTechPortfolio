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
      <motion.span
        aria-hidden
        className={cn(
          'absolute left-0 inline-block h-2 w-2 rounded-full',
          isCurrent ? 'bg-accent' : 'bg-text-1',
        )}
        variants={scale}
        animate={isActive || isCurrent ? 'open' : 'closed'}
      />
      <button
        type="button"
        onClick={handleClick}
        aria-current={isCurrent ? 'page' : undefined}
        className={cn(
          'flex min-h-[52px] w-full cursor-pointer items-center pl-6 text-left font-display text-[1.75rem] font-bold leading-none tracking-tight transition duration-200 hover:translate-x-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none md:text-4xl',
          isCurrent ? 'text-text-strong' : 'text-text-1',
        )}
      >
        {title}
      </button>
    </motion.div>
  );
};
export default NavLink;
