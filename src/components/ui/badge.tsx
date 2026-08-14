import { FC, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type BadgeTone = 'green' | 'red' | 'amber' | 'brand' | 'sky' | 'emerald' | 'neutral';
export type BadgeVariant = 'solid' | 'outline';

const SOLID: Record<BadgeTone, string> = {
  green: 'bg-success-surface/15 text-success',
  red: 'bg-danger-surface/15 text-danger',
  amber: 'bg-warning-surface/15 text-warning',
  brand: 'bg-primary/15 text-primary',
  sky: 'bg-sky-500/15 text-sky-300',
  emerald: 'bg-success-surface/15 text-success',
  neutral: 'bg-text-1/10 text-text-2',
};

const OUTLINE: Record<BadgeTone, string> = {
  green: 'border border-success/30 bg-success-surface/5 text-success',
  red: 'border border-danger/30 bg-danger-surface/5 text-danger',
  amber: 'border border-warning/30 bg-warning-surface/5 text-warning',
  brand: 'border border-primary/40 bg-primary/5 text-primary',
  sky: 'border border-sky-400/30 bg-sky-500/5 text-sky-300',
  emerald: 'border border-success/30 bg-success-surface/5 text-success',
  neutral: 'border border-stroke bg-transparent text-text-3',
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
