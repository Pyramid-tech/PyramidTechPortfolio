'use client';

import { FC, SVGProps, useState } from 'react';

import { cn } from '@/lib/utils';

interface Props {
  steps: { title: string; icon: FC<SVGProps<SVGSVGElement>>; description: string }[];
}

const ProcessSteps: FC<Props> = ({ steps }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <ol className="relative flex flex-col">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;

        return (
          <li
            key={step.title}
            className="relative flex gap-5 md:gap-8"
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-display text-sm font-semibold tabular-nums transition duration-200',
                  hoveredIdx === idx
                    ? 'border-accent bg-accent text-bg-1'
                    : 'border-stroke bg-bg-2 text-text-2',
                )}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>
              {!isLast && <span aria-hidden className="w-px flex-1 bg-stroke" />}
            </div>

            <div className={cn('flex flex-col gap-2 pt-2', isLast ? 'pb-0' : 'pb-10 md:pb-12')}>
              <div className="flex items-center gap-3">
                <step.icon />
                <h3 className="font-display text-xl font-semibold leading-tight md:text-2xl">
                  {step.title}
                </h3>
              </div>
              <p className="max-w-[62ch] text-sm leading-relaxed text-text-2 md:text-base">
                {step.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default ProcessSteps;
