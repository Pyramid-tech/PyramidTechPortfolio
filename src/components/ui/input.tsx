import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { cn } from '@/lib/utils';

export type InputVariant = 'admin' | 'marketing';

// Two distinct visual systems live behind one component: the compact admin
// style (dashboard / login) and the larger marketing style (book form).
const VARIANTS: Record<InputVariant, string> = {
  admin:
    'rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm text-text-1 outline-none transition focus:border-primary',
  marketing:
    'h-12 w-full rounded-lg border border-stroke bg-bg-1/40 px-4 text-base text-text-1 outline-none transition placeholder:text-text-1/30 hover:border-stroke/80 focus:border-primary focus:ring-2 focus:ring-primary/30',
};

interface Props extends ComponentPropsWithoutRef<'input'> {
  variant?: InputVariant;
}

const Input = forwardRef<HTMLInputElement, Props>(({ variant = 'admin', className, ...props }, ref) => (
  <input ref={ref} className={cn(VARIANTS[variant], className)} {...props} />
));
Input.displayName = 'Input';

export default Input;
