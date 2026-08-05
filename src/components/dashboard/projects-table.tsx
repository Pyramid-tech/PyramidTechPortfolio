'use client';

import { FC } from 'react';
import Link from 'next/link';

import type { AdminProjectListItemDTO } from '@/types/project';
import { ORIGIN_LABELS, PLATFORM_LABELS } from '@/types/project';
import { EmptyState, HeadRow, Table, TableCard, Td, Th } from '@/components/ui/table';

import ProjectStatusBadge from './project-status-badge';

interface RowProps {
  project: AdminProjectListItemDTO;
  togglingId: string | null;
  onToggleStatus: (project: AdminProjectListItemDTO) => void;
}

interface Props extends Omit<RowProps, 'project'> {
  projects: AdminProjectListItemDTO[];
}

function platformSummary(platforms: AdminProjectListItemDTO['platforms']): string {
  return platforms.map((p) => PLATFORM_LABELS[p] ?? p).join(', ');
}

function updatedLabel(updatedAt: Date | null): string {
  if (!updatedAt) return '—';
  return new Date(updatedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const ProjectActions: FC<RowProps> = ({ project, togglingId, onToggleStatus }) => (
  <>
    <Link
      href={`/dashboard/projects/${project.id}/edit`}
      className="rounded-md px-2 py-1.5 text-xs text-primary transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-3"
    >
      Edit
    </Link>
    <button
      onClick={() => onToggleStatus(project)}
      disabled={togglingId === project.id}
      className={`rounded-md px-2 py-1.5 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 sm:px-3 ${
        project.isActive ? 'text-red-400 hover:bg-red-500/10' : 'text-green-400 hover:bg-green-500/10'
      }`}
    >
      {togglingId === project.id ? '…' : project.isActive ? 'Deactivate' : 'Reactivate'}
    </button>
  </>
);

const ProjectCard: FC<RowProps> = (props) => {
  const { project } = props;
  return (
    <div className="rounded-2xl border border-stroke bg-bg-2 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-text-1">{project.title}</p>
          <p className="truncate text-sm text-text-1/60">{ORIGIN_LABELS[project.origin]}</p>
        </div>
        <ProjectStatusBadge isActive={project.isActive} className="shrink-0" />
      </div>

      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-text-1/50">
        {project.client && (
          <div className="flex min-w-0 items-center gap-1">
            <dt className="shrink-0">Client:</dt>
            <dd className="truncate text-text-1/70">{project.client}</dd>
          </div>
        )}
        {project.platforms.length > 0 && (
          <div className="flex min-w-0 items-center gap-1">
            <dt className="shrink-0">Platforms:</dt>
            <dd className="truncate text-text-1/70">{platformSummary(project.platforms)}</dd>
          </div>
        )}
        <div className="flex items-center gap-1">
          <dt className="shrink-0">Order:</dt>
          <dd className="text-text-1/70">{project.displayOrder}</dd>
        </div>
        {project.featured && (
          <div className="flex items-center gap-1">
            <dt className="shrink-0">Featured</dt>
          </div>
        )}
      </dl>

      <div className="mt-3 flex flex-wrap justify-end gap-2 border-t border-stroke/50 pt-3">
        <ProjectActions {...props} />
      </div>
    </div>
  );
};

const ProjectsTable: FC<Props> = ({ projects, ...handlers }) => {
  if (projects.length === 0) {
    return (
      <TableCard>
        <EmptyState>No projects yet.</EmptyState>
      </TableCard>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:hidden">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} {...handlers} />
        ))}
      </div>

      <div className="hidden sm:block">
        <TableCard>
          <Table>
            <thead>
              <HeadRow>
                <Th>Title</Th>
                <Th className="hidden lg:table-cell">Client</Th>
                <Th className="hidden md:table-cell">Origin</Th>
                <Th className="hidden lg:table-cell">Platforms</Th>
                <Th className="hidden xl:table-cell">Featured</Th>
                <Th className="hidden lg:table-cell">Order</Th>
                <Th className="hidden xl:table-cell">Updated</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </HeadRow>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <tr
                  key={p.id}
                  className={`border-b border-stroke/50 transition hover:bg-bg-1/40 ${
                    i === projects.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <Td className="font-medium text-text-1">{p.title}</Td>
                  <Td className="hidden text-text-1/70 lg:table-cell">{p.client || '—'}</Td>
                  <Td className="hidden text-text-1/70 md:table-cell">{ORIGIN_LABELS[p.origin]}</Td>
                  <Td className="hidden text-text-1/70 lg:table-cell">
                    {platformSummary(p.platforms)}
                  </Td>
                  <Td className="hidden text-text-1/70 xl:table-cell">{p.featured ? 'Yes' : 'No'}</Td>
                  <Td className="hidden text-text-1/50 lg:table-cell">{p.displayOrder}</Td>
                  <Td className="hidden text-text-1/50 xl:table-cell">{updatedLabel(p.updatedAt)}</Td>
                  <Td>
                    <ProjectStatusBadge isActive={p.isActive} />
                  </Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-1 whitespace-nowrap sm:gap-2">
                      <ProjectActions project={p} {...handlers} />
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableCard>
      </div>
    </>
  );
};

export default ProjectsTable;
