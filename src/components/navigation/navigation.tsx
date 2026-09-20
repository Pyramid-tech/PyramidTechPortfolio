'use client';
import { FC, useEffect, useState } from 'react';

import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';

import { LogoIcon } from '@/components/icons';
import { ThemeToggle } from '@/components/theme';
import type { NavItem } from '@/lib/constants';
import { cn } from '@/lib/utils';

import SidebarMenu from './sidebar-menu';

interface Props {
  items: NavItem[];
}

const Navigation: FC<Props> = ({ items }) => {
  const [isActive, setIsActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeSidebar = () => setIsActive(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsActive(false);
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div>
      <div
        aria-hidden
        className={cn(
          'pointer-events-none fixed inset-x-0 top-0 z-header h-[72px] border-b transition duration-300 md:h-[88px]',
          scrolled && !isActive
            ? 'border-stroke/60 bg-bg-1/80 backdrop-blur-md'
            : 'border-transparent bg-transparent',
        )}
      />
      <Link
        href="/"
        title="Pyramid"
        aria-label="Pyramid - home"
        className="group fixed left-0 top-0 z-header flex items-center gap-2 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:gap-3 md:p-6"
      >
        <LogoIcon className="h-10 w-10 transition duration-300 group-hover:text-text-strong/80 md:h-12 md:w-12" />
        <span className="font-display text-lg font-extrabold uppercase tracking-[0.1em] text-text-1 transition duration-300 group-hover:text-text-strong sm:text-xl sm:tracking-[0.15em] md:text-2xl">
          Pyramid
        </span>
      </Link>
      <div className="fixed right-0 z-drawer-controls flex items-center gap-2 p-4 md:gap-3 md:p-6">
        <ThemeToggle />
        <button
          type="button"
          aria-label={isActive ? 'Close navigation' : 'Open navigation'}
          aria-expanded={isActive}
          aria-controls="site-navigation"
          onClick={() => setIsActive(!isActive)}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-control transition duration-200 ease-out hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-1 active:scale-[0.97] motion-reduce:transition-none md:h-12 md:w-12"
        >
          <div className="flex h-5 w-6 flex-col items-center justify-center gap-1.5">
            <span
              className={`h-0.5 w-full origin-center bg-on-control transition duration-300 motion-reduce:transition-none ${
                isActive ? 'translate-y-1 rotate-45' : ''
              }`}
            />
            <span
              className={`h-0.5 w-full origin-center bg-on-control transition duration-300 motion-reduce:transition-none ${
                isActive ? '-translate-y-1 -rotate-45' : ''
              }`}
            />
          </div>
        </button>
      </div>
      <AnimatePresence mode="wait">
        {isActive && <SidebarMenu items={items} close={closeSidebar} />}
      </AnimatePresence>
    </div>
  );
};
export default Navigation;
