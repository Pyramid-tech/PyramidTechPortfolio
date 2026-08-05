import ProjectFormPage from '@/components/dashboard/project-form-page';
import { requireUser } from '@/lib/auth';

export default async function NewProjectPage() {
  await requireUser();

  return <ProjectFormPage mode="create" />;
}
