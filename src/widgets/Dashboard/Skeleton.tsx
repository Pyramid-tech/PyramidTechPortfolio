import { FC } from 'react';

const SkeletonRow: FC = () => (
  <tr className="border-b border-stroke/50">
    <td className="px-6 py-4">
      <div className="h-3.5 w-28 rounded bg-bg-1" />
    </td>
    <td className="px-6 py-4">
      <div className="h-3.5 w-36 rounded bg-bg-1" />
    </td>
    <td className="px-6 py-4">
      <div className="h-3.5 w-44 rounded bg-bg-1" />
    </td>
    <td className="px-6 py-4">
      <div className="h-3.5 w-6 rounded bg-bg-1" />
    </td>
    <td className="px-6 py-4">
      <div className="h-5 w-16 rounded-full bg-bg-1" />
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center justify-end gap-2">
        <div className="h-6 w-9 rounded-md bg-bg-1" />
        <div className="h-6 w-20 rounded-md bg-bg-1" />
      </div>
    </td>
  </tr>
);

const DashboardSkeleton: FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="animate-pulse overflow-hidden rounded-2xl border border-stroke bg-bg-2">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-stroke text-left text-xs uppercase tracking-widest text-text-1/40">
          <th className="px-6 py-4">Name</th>
          <th className="px-6 py-4">Job Title</th>
          <th className="px-6 py-4">Email</th>
          <th className="px-6 py-4">Order</th>
          <th className="px-6 py-4">Status</th>
          <th className="px-6 py-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </tbody>
    </table>
  </div>
);

export default DashboardSkeleton;
