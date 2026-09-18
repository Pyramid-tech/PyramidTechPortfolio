'use client';

import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { usePathname, useRouter } from 'next/navigation';

import { type NavItem } from '@/lib/constants';
import { menuSlide } from '@/lib/animations';
import { SITE } from '@/lib/site';

import NavLink from './nav-link';

interface Props {
  items: NavItem[];
  close: () => void;
}

const SidebarMenu: FC<Props> = ({ items, close }) => {
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    return () => lenis?.start();
  }, [lenis]);

  const isCurrent = (item: NavItem) => {
    const [path, hash] = item.route.split('#');
    const pathnameOnly = path || '/';

    if (hash) return false;
    if (pathnameOnly === '/') return pathname === '/';
    return pathname.startsWith(pathnameOnly);
  };

  const navigate = (item: NavItem) => {
    lenis?.start();

    const [path, hash] = item.route.split('#');
    const pathnameOnly = path || '/';
    const hashId = hash ? `#${hash}` : null;

    if (pathname === pathnameOnly && hashId) {
      lenis?.scrollTo(hashId, { duration: 1.1 });
    } else if (pathname === pathnameOnly) {
      lenis?.scrollTo(0, { duration: 1.1 });
    } else {
      router.push(item.route);
    }
    close();
  };
  return (
    <>
      <motion.nav
        id="site-navigation"
        aria-label="Main"
        variants={menuSlide}
        initial="initial"
        animate="enter"
        exit="exit"
        className="fixed right-0 top-0 z-drawer flex h-[100svh] w-[86%] max-w-sm flex-col justify-between bg-gray-1 px-8 pb-10 pt-24 text-text-1"
      >
        <div>
          <div className="mb-8 w-full border-b border-stroke pb-2 uppercase text-text-3">
            <h2 className="font-display text-xs leading-tight tracking-[0.18em] md:text-sm">Navigation</h2>
          </div>
          <div className="flex flex-col gap-1" onMouseLeave={() => setSelectedIndicator(null)}>
            {items.map((item, index) => (
              <NavLink
                handleClick={() => navigate(item)}
                key={item.title}
                data={{ ...item, index }}
                isActive={selectedIndicator === item.route}
                isCurrent={isCurrent(item)}
                setSelectedIndicator={setSelectedIndicator}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-stroke pt-6 text-sm">
          <div className="flex flex-col gap-1">
            <span className="font-display text-[0.7rem] uppercase tracking-[0.18em] text-text-3">Get in touch</span>
            <a
              href={`mailto:${SITE.email}`}
              className="flex min-h-11 items-center text-text-1 transition hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {SITE.email}
            </a>
          </div>
          <span className="text-text-3">{SITE.location}</span>
        </div>
      </motion.nav>
      <div
        aria-hidden="true"
        onClick={close}
        className="fixed bottom-0 left-0 right-0 top-0 z-scrim bg-scrim transition"
      ></div>
    </>
  );
};
export default SidebarMenu;
