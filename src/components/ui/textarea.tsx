import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { cn } from '@/lib/utils';

export type TextareaVariant = 'admin' | 'marketing';

const VARIANTS: Record<TextareaVariant, string> = {
  admin:
    'resize-none rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm text-text-1 outline-none transition focus:border-primary',
  marketing:
    'min-h-[140px] w-full resize-none rounded-lg border border-stroke bg-bg-1/40 px-4 py-3 text-base text-text-1 outline-none transition placeholder:text-text-1/30 hover:border-stroke/80 focus:border-primary focus:ring-2 focus:ring-primary/30',
};

interface Props extends ComponentPropsWithoutRef<'textarea'> {
  variant?: TextareaVariant;
}

const Textarea = forwardRef<HTMLTextAreaElement, Props>(({ variant = 'admin', className, ...props }, ref) => (
  <textarea ref={ref} className={cn(VARIANTS[variant], className)} {...props} />
));
Textarea.displayName = 'Textarea';

export default Textarea;
