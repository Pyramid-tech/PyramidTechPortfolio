import { FC, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type BadgeTone = 'green' | 'red' | 'amber';

const TONES: Record<BadgeTone, string> = {
  green: 'bg-green-500/15 text-green-400',
  red: 'bg-red-500/15 text-red-400',
  amber: 'bg-amber-500/15 text-amber-400',
};

const Badge: FC<{ tone: BadgeTone; className?: string; children: ReactNode }> = ({ tone, className, children }) => (
  <span className={cn('inline-block whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium sm:px-3', TONES[tone], className)}>{children}</span>
);

export default Badge;
