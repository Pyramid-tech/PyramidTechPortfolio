import { Dashboard } from '@/components/dashboard';
import { requireUser } from '@/lib/auth';
import { getAdminTeamMembers, getApproverId } from '@/lib/data/team';
import { getBookRequests } from '@/lib/data/book';

export default async function DashboardPage() {
  const user = await requireUser();
  const [members, requests, approverId] = await Promise.all([
    getAdminTeamMembers(),
    getBookRequests(),
    getApproverId(),
  ]);

  return (
    <Dashboard
      initialMembers={members}
      initialRequests={requests}
      isApprover={user.id === approverId}
    />
  );
}
