import { FC } from 'react';

import { cn } from '@/lib/utils';

const ProjectFallbackVisual: FC<{ label?: string; className?: string }> = ({
  label,
  className,
}) => (
  <div
    aria-hidden
    className={cn(
      'relative flex h-full w-full items-center justify-center overflow-hidden bg-accent-deep px-6',
      className,
    )}
  >
    <svg
      aria-hidden
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full text-accent"
    >
      <defs>
        <linearGradient id="project-fallback-face" x1="0" y1="1" x2="0.3" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.12" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <g stroke="currentColor" strokeOpacity="0.16">
        <path d="M0 200h400M0 150h400M0 100h400M0 50h400" />
        <path d="M50 0v260M100 0v260M150 0v260M200 0v260M250 0v260M300 0v260M350 0v260" />
      </g>
      <path d="M200 55 300 215H100z" fill="url(#project-fallback-face)" />
      <path d="M200 55 300 215H200z" fill="currentColor" fillOpacity="0.14" />
      <path d="M148 160h104l16 26H132z" fill="currentColor" fillOpacity="0.10" />
    </svg>

    {label && (
      <span className="relative max-w-[18ch] text-balance text-center font-display text-2xl font-bold leading-tight text-text-1 sm:text-3xl">
        {label}
      </span>
    )}
  </div>
);

export default ProjectFallbackVisual;
