import DashboardSkeleton from '@/components/dashboard/skeleton';

export default function RequestsLoading() {
  return (
    <>
      <div className="mb-6 h-12 sm:mb-8" />
      <DashboardSkeleton rows={5} variant="requests" />
    </>
  );
}
