'use client';
import { FC, useEffect, useState } from 'react';

import { AnimatePresence } from 'framer-motion';

import { LogoIcon } from '@/components/icons';

import SidebarMenu from './sidebar-menu';


const Navigation: FC = () => {
  const [isActive, setIsActive] = useState(false);
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
  return (
    <div>
      <div className="fixed right-0 z-[4001] p-4 md:p-6">
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setIsActive(!isActive)}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-stone-400 md:h-12 md:w-12"
        >
          <div className="flex h-5 w-6 flex-col items-center justify-center gap-1.5">
            <span
              className={`h-0.5 w-full origin-center bg-neutral-700 transition duration-300 ${
                isActive ? 'translate-y-1 rotate-45' : ''
              }`}
            />
            <span
              className={`h-0.5 w-full origin-center bg-neutral-700 transition duration-300 ${
                isActive ? '-translate-y-1 -rotate-45' : ''
              }`}
            />
          </div>
        </button>
      </div>
      <button title="pyramid-icon" className="group fixed left-0 top-0 z-[100] p-4 md:p-6">
        <LogoIcon className="h-10 w-10 transition duration-300 group-hover:text-white/80 md:h-12 md:w-12" />
      </button>
      <AnimatePresence mode="wait">{isActive && <SidebarMenu close={closeSidebar} />}</AnimatePresence>
    </div>
  );
};
export default Navigation;
