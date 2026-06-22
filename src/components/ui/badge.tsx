import { FC, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type BadgeTone = 'green' | 'red';

const TONES: Record<BadgeTone, string> = {
  green: 'bg-green-500/15 text-green-400',
  red: 'bg-red-500/15 text-red-400',
};

const Badge: FC<{ tone: BadgeTone; className?: string; children: ReactNode }> = ({ tone, className, children }) => (
  <span className={cn('rounded-full px-2 py-1 text-xs font-medium sm:px-3', TONES[tone], className)}>{children}</span>
);

export default Badge;
