import ProjectsManager from '@/components/dashboard/projects-manager';
import { requireUser } from '@/lib/auth';
import { getAdminProjects } from '@/lib/data/project';

export default async function DashboardProjectsPage() {
  await requireUser();
  const projects = await getAdminProjects();

  return <ProjectsManager projects={projects} />;
}
