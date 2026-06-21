'use client';
import { FC, useEffect, useState } from 'react';

import SidebarMenu from '@/components/sidebar-menu/sidebar-menu';
import { AnimatePresence } from 'framer-motion';
import { LogoIcon } from '@/components/icons/logo';


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
      <div className="fixed right-0 z-[4001] p-[2vw]">
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          className="flex h-[4.5vw] w-[4.5vw] cursor-pointer items-center justify-center rounded-full bg-stone-400"
        >
          <div className={`burger ${isActive && 'burgerActive'}`}></div>
        </button>
      </div>
      <button title="pyramid-icon" className="group fixed left-0 top-0 z-[100] p-[2vw]">
        <LogoIcon className="h-[5vw] w-[5vw] transition duration-300 group-hover:text-white/80" />
      </button>
      <AnimatePresence mode="wait">{isActive && <SidebarMenu close={closeSidebar} />}</AnimatePresence>
    </div>
  );
};
export default Navigation;
