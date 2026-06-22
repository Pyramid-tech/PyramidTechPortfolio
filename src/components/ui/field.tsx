import { FC, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface Props {
  label: ReactNode;
  className?: string;
  labelClassName?: string;
  children: ReactNode;
}

// Label + control wrapper shared by the admin forms (member, login).
const Field: FC<Props> = ({ label, className, labelClassName, children }) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    <label className={cn('text-xs uppercase tracking-widest text-text-1/50', labelClassName)}>{label}</label>
    {children}
  </div>
);

export default Field;
