import TeamManager from '@/components/dashboard/team-manager';
import { requireUser } from '@/lib/auth';
import { getAdminTeamMembers, getApproverId } from '@/lib/data/team';

export default async function DashboardPage() {
  const user = await requireUser();
  const [members, approverId] = await Promise.all([getAdminTeamMembers(), getApproverId()]);

  return <TeamManager members={members} isApprover={user.id === approverId} />;
}
