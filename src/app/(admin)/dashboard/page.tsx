import { Dashboard } from '@/components/dashboard';
import { requireUser } from '@/lib/auth';
import { getAdminTeamMembers } from '@/lib/data/team';
import { getBookRequests } from '@/lib/data/book';

export default async function DashboardPage() {
  await requireUser();
  const [members, requests] = await Promise.all([getAdminTeamMembers(), getBookRequests()]);

  return <Dashboard initialMembers={members} initialRequests={requests} />;
}
