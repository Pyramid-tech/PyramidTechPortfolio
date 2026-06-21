import { FC } from 'react';

const TeamSkeletonRow: FC = () => (
  <tr className="border-b border-stroke/50">
    <td className="px-4 py-4 sm:px-6"><div className="h-3.5 w-24 rounded bg-bg-1" /></td>
    <td className="hidden px-4 py-4 sm:table-cell sm:px-6"><div className="h-3.5 w-28 rounded bg-bg-1" /></td>
    <td className="hidden px-4 py-4 md:table-cell sm:px-6"><div className="h-3.5 w-36 rounded bg-bg-1" /></td>
    <td className="hidden px-4 py-4 lg:table-cell sm:px-6"><div className="h-3.5 w-6 rounded bg-bg-1" /></td>
    <td className="px-4 py-4 sm:px-6"><div className="h-5 w-14 rounded-full bg-bg-1" /></td>
    <td className="px-4 py-4 sm:px-6">
      <div className="flex items-center justify-end gap-2">
        <div className="h-6 w-8 rounded-md bg-bg-1" />
        <div className="h-6 w-16 rounded-md bg-bg-1" />
      </div>
    </td>
  </tr>
);

const RequestSkeletonRow: FC = () => (
  <tr className="border-b border-stroke/50">
    <td className="px-4 py-4 sm:px-6"><div className="h-3.5 w-24 rounded bg-bg-1" /></td>
    <td className="hidden px-4 py-4 md:table-cell sm:px-6"><div className="h-3.5 w-36 rounded bg-bg-1" /></td>
    <td className="hidden px-4 py-4 md:table-cell sm:px-6"><div className="h-3.5 w-28 rounded bg-bg-1" /></td>
    <td className="px-4 py-4 sm:px-6"><div className="h-3.5 w-20 rounded bg-bg-1" /></td>
    <td className="hidden px-4 py-4 lg:table-cell sm:px-6"><div className="h-3.5 w-16 rounded bg-bg-1" /></td>
    <td className="hidden px-4 py-4 sm:table-cell sm:px-6"><div className="h-3.5 w-20 rounded bg-bg-1" /></td>
    <td className="px-4 py-4 sm:px-6">
      <div className="flex justify-end"><div className="h-6 w-10 rounded-md bg-bg-1" /></div>
    </td>
  </tr>
);

const DashboardSkeleton: FC<{ rows?: number; tab?: 'team' | 'requests' }> = ({ rows = 5, tab = 'team' }) => (
  <div className="animate-pulse overflow-hidden rounded-2xl border border-stroke bg-bg-2">
    <div className="overflow-x-auto">
      <table className={`w-full text-sm ${tab === 'team' ? 'min-w-[480px]' : 'min-w-[480px]'}`}>
        <thead>
          {tab === 'team' ? (
            <tr className="border-b border-stroke text-left text-xs uppercase tracking-widest text-text-1/40">
              <th className="px-4 py-4 sm:px-6">Name</th>
              <th className="hidden px-4 py-4 sm:table-cell sm:px-6">Job Title</th>
              <th className="hidden px-4 py-4 md:table-cell sm:px-6">Email</th>
              <th className="hidden px-4 py-4 lg:table-cell sm:px-6">Order</th>
              <th className="px-4 py-4 sm:px-6">Status</th>
              <th className="px-4 py-4 text-right sm:px-6">Actions</th>
            </tr>
          ) : (
            <tr className="border-b border-stroke text-left text-xs uppercase tracking-widest text-text-1/40">
              <th className="px-4 py-4 sm:px-6">Name</th>
              <th className="hidden px-4 py-4 md:table-cell sm:px-6">Email</th>
              <th className="hidden px-4 py-4 md:table-cell sm:px-6">Company</th>
              <th className="px-4 py-4 sm:px-6">Service</th>
              <th className="hidden px-4 py-4 lg:table-cell sm:px-6">Budget</th>
              <th className="hidden px-4 py-4 sm:table-cell sm:px-6">Date</th>
              <th className="px-4 py-4 text-right sm:px-6">Details</th>
            </tr>
          )}
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) =>
            tab === 'team' ? <TeamSkeletonRow key={i} /> : <RequestSkeletonRow key={i} />,
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default DashboardSkeleton;
