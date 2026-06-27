'use client';

import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { usePathname, useRouter } from 'next/navigation';

import { NAV_ITEMS } from '@/lib/constants';
import { menuSlide } from '@/lib/animations';

import NavLink from './nav-link';

interface Props {
  close: () => void;
}

const SidebarMenu: FC<Props> = ({ close }) => {
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();

  const smoothScroll = (id: string) => {
    if (pathname !== '/') {
      // Let the home page's useHashScroll handle the smooth scroll on arrival.
      router.push(`/#${id}`, { scroll: false });
      close();
      return;
    }
    // Scroll through Lenis (the active smooth-scroll engine) instead of the
    // browser's native scroll, which otherwise fights Lenis and stutters.
    lenis?.scrollTo(`#${id}`, { duration: 1.1 });
    close();
  };
  return (
    <>
      <motion.div
        variants={menuSlide}
        initial="initial"
        animate="enter"
        exit="exit"
        className="fixed right-0 top-0 z-[4000] h-screen w-4/5 max-w-xs bg-gray-1 px-8 pb-10 pt-20 text-text-1"
      >
        <div className="mb-6 w-full border-b border-white/20 pb-2 uppercase text-white/60 ">
          <h3 className="font-display text-xs leading-tight md:text-sm">Navigation</h3>
        </div>
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col justify-end space-y-2" onMouseLeave={() => setSelectedIndicator(null)}>
            {NAV_ITEMS.map((item, index) => (
              <NavLink
                handleClick={() => smoothScroll(item.href)}
                key={item.title}
                data={{ ...item, index }}
                isActive={selectedIndicator === item.href}
                setSelectedIndicator={setSelectedIndicator}
              />
            ))}
          </div>
        </div>
      </motion.div>
      <div
        aria-label="button"
        onClick={close}
        className="fixed bottom-0 left-0 right-0 top-0 z-[750] bg-bg-1/60 transition"
      ></div>
    </>
  );
};
export default SidebarMenu;
