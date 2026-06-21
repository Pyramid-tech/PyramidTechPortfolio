import DashboardSkeleton from '@/components/sections/dashboard/skeleton';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-bg-1 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 h-12 sm:mb-8" />
        <DashboardSkeleton rows={5} tab="team" />
      </div>
    </div>
  );
}
