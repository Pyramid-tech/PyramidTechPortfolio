import { FC } from 'react';

import { LogoIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

const ProjectFallbackVisual: FC<{ className?: string }> = ({ className }) => (
  <div
    aria-hidden
    className={cn(
      'flex h-full w-full items-center justify-center bg-gradient-to-br from-bg-2 via-bg-1 to-bg-2',
      className,
    )}
  >
    <LogoIcon className="h-1/3 max-h-16 w-auto text-text-1/15" />
  </div>
);

export default ProjectFallbackVisual;
