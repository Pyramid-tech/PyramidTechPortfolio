'use client';

import { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { AdminProjectDTO, CreateProjectInput, ProjectMutationResult } from '@/types/project';
import { createProjectAction, updateProjectAction } from '@/lib/actions/project';
import ProjectForm from '@/components/forms/project-form';

import DashboardHeader from './dashboard-header';
import DashboardNav from './dashboard-nav';

interface Props {
  mode: 'create' | 'edit';
  project?: AdminProjectDTO;
}

const ProjectFormPage: FC<Props> = ({ mode, project }) => {
  const router = useRouter();

  const handleSubmit = async (input: CreateProjectInput): Promise<ProjectMutationResult> => {
    const res =
      mode === 'create'
        ? await createProjectAction(input)
        : await updateProjectAction(project!.id, input);

    if (res.ok) {
      if (mode === 'create') router.push(`/dashboard/projects/${res.id}/edit`);
      else router.refresh();
    }
    return res;
  };

  return (
    <>
      <DashboardHeader />
      <DashboardNav />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/dashboard/projects"
            className="text-xs text-text-1/50 transition hover:text-text-1"
          >
            ← Back to projects
          </Link>
          <h2 className="mt-1 font-display text-xl font-semibold text-text-1">
            {mode === 'create' ? 'New project' : project?.title}
          </h2>
        </div>
        {mode === 'edit' && project && !project.isActive && (
          <p className="rounded-full bg-danger-surface/15 px-3 py-1 text-xs text-danger">
            Deactivated — hidden from all public pages
          </p>
        )}
      </div>

      <ProjectForm mode={mode} project={project} onSubmit={handleSubmit} />
    </>
  );
};

export default ProjectFormPage;
