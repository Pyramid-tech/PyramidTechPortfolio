'use client';

import { FC, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

const PHASES = ['Scope', 'Build', 'Ship'];

const AboutPyramid: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let dispose: (() => void) | undefined;
    let cancelled = false;

    import('./blueprint')
      .then(({ default: mountBlueprint }) => {
        if (cancelled) return;
        dispose = mountBlueprint(canvas, { onPhase: setPhase });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-stroke/60 bg-bg-2 md:aspect-[5/4] md:grow-[3] md:basis-0">
      {failed ? (
        <div className="absolute left-1/2 top-1/2 h-1/3 w-1/3 -translate-x-1/2 -translate-y-1/2 opacity-80">
          <Image
            src="/images/logo/icon-nobg.png"
            alt=""
            fill
            sizes="200px"
            className="object-contain"
          />
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="A wireframe pyramid is drawn like a blueprint, then fills in layer by layer into a solid form"
            className="absolute inset-0 block h-full w-full"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-5 top-4 flex gap-4 font-display text-xs font-medium uppercase tracking-[0.18em]"
          >
            {PHASES.map((label, index) => (
              <span
                key={label}
                className={cn(
                  'transition-colors duration-500',
                  index === phase ? 'text-text-1' : 'text-text-3/70',
                )}
              >
                {`0${index + 1} ${label}`}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AboutPyramid;
