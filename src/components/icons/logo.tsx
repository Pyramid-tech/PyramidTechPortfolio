import { FC } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

// Brand logo (an image, not an inline SVG) — only the className is configurable.
export const LogoIcon: FC<{ className?: string }> = ({ className }) => (
  <Image
    src="/images/drafted-icon.svg"
    alt="PyramidTech logo"
    width={640}
    height={640}
    unoptimized
    className={cn('object-contain grayscale group-hover:grayscale-0', className)}
  />
);
