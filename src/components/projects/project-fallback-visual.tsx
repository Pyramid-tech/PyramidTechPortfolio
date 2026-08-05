import { FC } from 'react';

import { LogoIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

const ProjectFallbackVisual: FC<{ label?: string; className?: string }> = ({ label, className }) => (
  <div
    aria-hidden
    className={cn(
      'flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-bg-2 via-bg-1 to-bg-2 px-6 text-center',
      className,
    )}
  >
    <LogoIcon className="h-8 w-auto text-text-1/15" />
    {label && (
      <span className="font-display text-2xl font-semibold leading-tight text-text-1/25 sm:text-3xl">
        {label}
      </span>
    )}
  </div>
);

export default ProjectFallbackVisual;
