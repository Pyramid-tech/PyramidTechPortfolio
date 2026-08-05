import { FC, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type BadgeTone = 'green' | 'red' | 'amber' | 'brand' | 'sky' | 'emerald' | 'neutral';
export type BadgeVariant = 'solid' | 'outline';

const SOLID: Record<BadgeTone, string> = {
  green: 'bg-green-500/15 text-green-400',
  red: 'bg-red-500/15 text-red-400',
  amber: 'bg-amber-500/15 text-amber-400',
  brand: 'bg-primary/15 text-primary',
  sky: 'bg-sky-500/15 text-sky-300',
  emerald: 'bg-emerald-500/15 text-emerald-300',
  neutral: 'bg-text-1/10 text-text-1/70',
};

const OUTLINE: Record<BadgeTone, string> = {
  green: 'border border-green-400/30 bg-green-500/5 text-green-300',
  red: 'border border-red-400/30 bg-red-500/5 text-red-300',
  amber: 'border border-amber-400/30 bg-amber-500/5 text-amber-300',
  brand: 'border border-primary/40 bg-primary/5 text-primary',
  sky: 'border border-sky-400/30 bg-sky-500/5 text-sky-300',
  emerald: 'border border-emerald-400/30 bg-emerald-500/5 text-emerald-300',
  neutral: 'border border-stroke bg-transparent text-text-1/60',
};

interface Props {
  tone: BadgeTone;
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
}

const Badge: FC<Props> = ({ tone, variant = 'solid', className, children }) => (
  <span
    className={cn(
      'inline-block whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium sm:px-3',
      variant === 'solid' ? SOLID[tone] : OUTLINE[tone],
      className,
    )}
  >
    {children}
  </span>
);

export default Badge;
