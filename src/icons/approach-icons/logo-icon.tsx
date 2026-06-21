import { SVGProps, FC } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

export const LogoIcon: FC<SVGProps<SVGSVGElement>> = ({ className }) => (
  <Image
    src="/images/drafted-icon.svg"
    alt="PyramidTech logo"
    width={640}
    height={640}
    unoptimized
    className={cn('object-contain grayscale group-hover:grayscale-0', className)}
  />
);
