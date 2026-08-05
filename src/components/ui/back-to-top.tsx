'use client';

import { FC } from 'react';
import { useLenis } from 'lenis/react';

const BackToTop: FC = () => {
  const lenis = useLenis();

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (lenis) {
      lenis.scrollTo(0, reduceMotion ? { immediate: true } : { duration: 1.1 });
      return;
    }
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="inline-flex items-center gap-1 rounded transition hover:text-text-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      Back to top ↑
    </button>
  );
};

export default BackToTop;
