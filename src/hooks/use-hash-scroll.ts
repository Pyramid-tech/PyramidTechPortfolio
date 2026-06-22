'use client';

import { useEffect } from 'react';
import { useLenis } from 'lenis/react';

// When the home page mounts with a URL hash (e.g. arriving from another route
// via a "/#contact" menu link), smooth-scroll to that section with Lenis.
// Starts from the top so the motion is always visible, regardless of where the
// previous route left the scroll position.
export function useHashScroll() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const hash = window.location.hash.slice(1);
    if (!hash) return;

    lenis.scrollTo(0, { immediate: true });
    const timer = window.setTimeout(() => {
      lenis.scrollTo(`#${hash}`, { duration: 1.2 });
    }, 100);

    return () => window.clearTimeout(timer);
  }, [lenis]);
}
