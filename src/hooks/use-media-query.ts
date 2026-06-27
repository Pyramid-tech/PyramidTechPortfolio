'use client';

import { useEffect, useState } from 'react';

/**
 * SSR-safe `matchMedia` hook. Starts `false` on the server and the first client
 * render (so hydration matches), then resolves to the real value once mounted.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** True on touch / stylus devices that have no precise hover pointer. */
export const useIsCoarsePointer = () => useMediaQuery('(pointer: coarse)');

/** True when the user has asked the OS to reduce motion. */
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
