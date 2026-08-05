import { FC } from 'react';

export type SkeletonVariant = 'team' | 'requests' | 'projects';

interface Column {
  label: string;
  className?: string;
  width: string;
}

const COLUMNS: Record<SkeletonVariant, Column[]> = {
  team: [
    { label: 'Name', width: 'w-24' },
    { label: 'Job Title', className: 'hidden sm:table-cell', width: 'w-28' },
    { label: 'Email', className: 'hidden md:table-cell', width: 'w-36' },
    { label: 'Order', className: 'hidden lg:table-cell', width: 'w-6' },
    { label: 'Status', width: 'w-14' },
    { label: 'Actions', className: 'text-right', width: 'w-24' },
  ],
  requests: [
    { label: 'Name', width: 'w-24' },
    { label: 'Email', className: 'hidden md:table-cell', width: 'w-36' },
    { label: 'Company', className: 'hidden md:table-cell', width: 'w-28' },
    { label: 'Service', width: 'w-20' },
    { label: 'Budget', className: 'hidden lg:table-cell', width: 'w-16' },
    { label: 'Date', className: 'hidden sm:table-cell', width: 'w-20' },
    { label: 'Details', className: 'text-right', width: 'w-10' },
  ],
  projects: [
    { label: 'Title', width: 'w-32' },
    { label: 'Client', className: 'hidden lg:table-cell', width: 'w-24' },
    { label: 'Origin', className: 'hidden md:table-cell', width: 'w-20' },
    { label: 'Platforms', className: 'hidden lg:table-cell', width: 'w-28' },
    { label: 'Order', className: 'hidden lg:table-cell', width: 'w-6' },
    { label: 'Status', width: 'w-14' },
    { label: 'Actions', className: 'text-right', width: 'w-24' },
  ],
};

const DashboardSkeleton: FC<{ rows?: number; variant?: SkeletonVariant }> = ({
  rows = 5,
  variant = 'team',
}) => {
  const columns = COLUMNS[variant];

  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-stroke bg-bg-2">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-stroke text-left text-xs uppercase tracking-widest text-text-1/40">
              {columns.map((column) => (
                <th key={column.label} className={`px-4 py-4 sm:px-6 ${column.className ?? ''}`}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-stroke/50">
                {columns.map((column) => (
                  <td key={column.label} className={`px-4 py-4 sm:px-6 ${column.className ?? ''}`}>
                    <div
                      className={`h-3.5 rounded bg-bg-1 ${column.width} ${
                        column.className?.includes('text-right') ? 'ml-auto' : ''
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
