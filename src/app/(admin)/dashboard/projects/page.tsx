import ProjectsManager from '@/components/dashboard/projects-manager';
import { requireUser } from '@/lib/auth';
import { getAdminProjects } from '@/lib/data/project';
import { withDbRetry } from '@/lib/db/retry';

export default async function DashboardProjectsPage() {
  await requireUser();
  const projects = await withDbRetry(getAdminProjects);

  return <ProjectsManager projects={projects} />;
}
