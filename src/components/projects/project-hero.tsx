import { FC } from 'react';
import Link from 'next/link';

import type { ProjectDetailDTO } from '@/types/project';

import ProjectMedia from './project-media';
import ProjectFacts from './project-facts';
import ProjectActions, { visibleActions } from './project-actions';
import { StatusBadges, detailStatusBadges } from './project-badges';

const ProjectHero: FC<{ project: ProjectDetailDTO }> = ({ project }) => {
  const actions = visibleActions(project);
  const status = detailStatusBadges(project);

  return (
    <header className="border-b border-gray-1 px-6 pb-12 pt-24 md:px-12 md:pb-16 md:pt-28">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/work"
          className="inline-flex items-center gap-1.5 text-sm text-text-1/50 transition hover:text-text-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span aria-hidden>←</span> Work
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
          <div className="flex flex-col gap-5">
            <StatusBadges badges={status} label={`${project.title} status`} />
            <h1 className="font-display text-4xl font-extrabold leading-none md:text-6xl lg:text-7xl">
              {project.title}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-text-1/70 md:text-lg">
              {project.summary}
            </p>
            {actions.length > 0 && <ProjectActions actions={actions} size="md" />}
          </div>

          <ProjectFacts project={project} />
        </div>

        <div className="lg:hidden">
          <div className="mt-12 overflow-hidden rounded-2xl border border-stroke">
            <ProjectMedia media={project.featuredMedia} aspect="aspect-[16/9]" eager />
          </div>
          {project.featuredMedia?.caption && (
            <p className="mt-3 text-xs text-text-1/40">{project.featuredMedia.caption}</p>
          )}
        </div>
      </div>
    </header>
  );
};

export default ProjectHero;
