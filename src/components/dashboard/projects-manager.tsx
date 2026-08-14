'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { AdminProjectListItemDTO } from '@/types/project';
import {
  deactivateProjectAction,
  reactivateProjectAction,
} from '@/lib/actions/project';
import Modal from '@/components/ui/modal';

import DashboardHeader from './dashboard-header';
import DashboardNav from './dashboard-nav';

import ProjectsTable from './projects-table';

const ProjectsManager: FC<{ projects: AdminProjectListItemDTO[] }> = ({ projects }) => {
  const router = useRouter();
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<AdminProjectListItemDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runToggle = async (project: AdminProjectListItemDTO) => {
    setError(null);
    setTogglingId(project.id);
    try {
      const res = project.isActive
        ? await deactivateProjectAction(project.id)
        : await reactivateProjectAction(project.id);
      if (res.ok) router.refresh();
      else setError(res.error);
    } finally {
      setTogglingId(null);
      setConfirming(null);
    }
  };

  const handleToggleStatus = (project: AdminProjectListItemDTO) => {
    if (project.isActive) setConfirming(project);
    else runToggle(project);
  };

  return (
    <>
      <DashboardHeader
        actions={
          <Link
            href="/dashboard/projects/new"
            className="rounded-lg border border-primary px-3 py-2 text-xs font-medium text-primary transition hover:bg-primary hover:text-bg-1 sm:px-4 sm:text-sm"
          >
            + Add Project
          </Link>
        }
      />
      <DashboardNav />

      {error && (
        <p className="mb-4 rounded-lg bg-danger-surface/10 px-4 py-2 text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <ProjectsTable
        projects={projects}
        togglingId={togglingId}
        onToggleStatus={handleToggleStatus}
      />

      {confirming && (
        <Modal onClose={() => setConfirming(null)}>
          <h2 className="mb-4 font-display text-xl font-bold uppercase tracking-widest text-primary">
            Deactivate project
          </h2>
          <p className="text-sm leading-relaxed text-text-2">
            <span className="font-medium text-text-1">{confirming.title}</span> will disappear from
            Selected Work, the projects page, project navigation and the sitemap. Nothing is
            deleted — it stays here and you can reactivate it at any time.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setConfirming(null)}
              className="rounded-lg px-4 py-2 text-sm text-text-3 transition hover:text-text-1"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => runToggle(confirming)}
              disabled={togglingId === confirming.id}
              className="rounded-lg border border-danger/60 bg-danger-surface/10 px-6 py-2 text-sm font-medium text-danger transition hover:bg-danger-surface hover:text-bg-1 disabled:opacity-50"
            >
              {togglingId === confirming.id ? 'Deactivating…' : 'Deactivate'}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProjectsManager;
