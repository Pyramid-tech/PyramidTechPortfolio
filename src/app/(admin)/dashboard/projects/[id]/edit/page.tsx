import { notFound } from 'next/navigation';

import ProjectFormPage from '@/components/dashboard/project-form-page';
import { requireUser } from '@/lib/auth';
import { getAdminProjectById } from '@/lib/data/project';

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  await requireUser();
  const project = await getAdminProjectById(params.id);
  if (!project) notFound();

  return <ProjectFormPage mode="edit" project={project} />;
}
