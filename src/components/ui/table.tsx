import { FC, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

// Bordered card that wraps a table (or an empty state).
export const TableCard: FC<{ className?: string; children: ReactNode }> = ({ className, children }) => (
  <div className={cn('overflow-hidden rounded-2xl border border-stroke bg-bg-2', className)}>{children}</div>
);

// Horizontally scrollable <table>.
export const Table: FC<{ className?: string; children: ReactNode }> = ({ className, children }) => (
  <div className="overflow-x-auto">
    <table className={cn('w-full min-w-[480px] text-sm', className)}>{children}</table>
  </div>
);

// Pre-styled header row.
export const HeadRow: FC<{ children: ReactNode }> = ({ children }) => (
  <tr className="border-b border-stroke text-left text-xs uppercase tracking-widest text-text-1/40">{children}</tr>
);

export const Th: FC<ThHTMLAttributes<HTMLTableCellElement>> = ({ className, children, ...props }) => (
  <th className={cn('px-4 py-4 sm:px-6', className)} {...props}>
    {children}
  </th>
);

export const Td: FC<TdHTMLAttributes<HTMLTableCellElement>> = ({ className, children, ...props }) => (
  <td className={cn('px-4 py-4 sm:px-6', className)} {...props}>
    {children}
  </td>
);

export const EmptyState: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="py-16 text-center text-text-1/40">{children}</div>
);
