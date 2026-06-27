'use client';

import { FC, useEffect } from 'react';

import initCursor from './init-cursor';

// The cursor is a continuously-rendering WebGL fluid simulation. Skip it on
// touch devices (there's no hover pointer to trail) and when the user prefers
// reduced motion — both to respect intent and to avoid a heavy per-frame rAF
// loop on phones. Checked synchronously so WebGL is never initialised there.
const prefersNoCursor = () =>
  window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ShadowCursor: FC = () => {
  useEffect(() => {
    if (prefersNoCursor()) return;
    const dispose = initCursor();
    return () => dispose();
  }, []);

  return (
    <div className="fixed left-0 top-0 z-[-1] h-screen w-full">
      <canvas id="fluid" className="h-full w-full" />
    </div>
  );
};

export default ShadowCursor;
