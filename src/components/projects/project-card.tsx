import { FC } from 'react';
import Link from 'next/link';

import type { ProjectCardDTO } from '@/types/project';
import { cn } from '@/lib/utils';

import ProjectMedia from './project-media';
import ProjectBadges, { ServiceTags } from './project-badges';
import ProjectActions, { visibleActions } from './project-actions';

interface Props {
  project: ProjectCardDTO;
  lead?: boolean;
  eager?: boolean;
}

const ProjectCard: FC<Props> = ({ project, lead, eager }) => {
  const actions = visibleActions(project);
  const services = project.services.slice(0, 3);
  const meta = [project.client, project.timeframe].filter(Boolean) as string[];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-stroke bg-bg-2 transition focus-within:border-primary/60 hover:border-text-1/30">
      <ProjectMedia
        media={project.featuredMedia}
        aspect={lead ? 'aspect-[16/9]' : 'aspect-[16/10]'}
        eager={eager}
        className="transition duration-500 motion-safe:group-hover:scale-[1.02]"
      />

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-col gap-1.5">
          <h3
            className={cn(
              'font-display font-semibold leading-tight text-text-1',
              lead ? 'text-2xl md:text-3xl' : 'text-xl',
            )}
          >
            <Link
              href={`/projects/${project.slug}`}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {project.title}
            </Link>
          </h3>
          {meta.length > 0 && (
            <p className="text-xs text-text-1/50">{meta.join(' · ')}</p>
          )}
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-text-1/70">{project.summary}</p>

        <ProjectBadges project={project} label={`${project.title} platforms`} />

        <ServiceTags services={services} label={`${project.title} Pyramid services`} />

        <div className="relative z-[1] mt-auto flex flex-wrap items-center gap-3 pt-2">
          <span className="text-xs font-medium text-primary">
            View case study <span aria-hidden>→</span>
          </span>
          {actions.length > 0 && <ProjectActions actions={actions.slice(0, 2)} />}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
