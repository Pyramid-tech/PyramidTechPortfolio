import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { cn } from '@/lib/utils';

const Select = forwardRef<HTMLSelectElement, ComponentPropsWithoutRef<'select'>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'rounded-lg border border-stroke bg-bg-2 px-3 py-2 text-sm text-text-1 outline-none transition focus:border-primary',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = 'Select';

export default Select;
