import DashboardHeader from '@/components/dashboard/dashboard-header';
import DashboardNav from '@/components/dashboard/dashboard-nav';
import RequestsTable from '@/components/dashboard/requests-table';
import { requireUser } from '@/lib/auth';
import { getBookRequests } from '@/lib/data/book';
import { withDbRetry } from '@/lib/db/retry';

export default async function RequestsPage() {
  await requireUser();
  const requests = await withDbRetry(getBookRequests);

  return (
    <>
      <DashboardHeader />
      <DashboardNav />
      <RequestsTable requests={requests} />
    </>
  );
}
