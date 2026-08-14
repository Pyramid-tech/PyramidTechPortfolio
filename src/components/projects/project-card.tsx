import { FC } from 'react';
import Link from 'next/link';

import type { ProjectCardDTO } from '@/types/project';
import { cn } from '@/lib/utils';

import ProjectMedia from './project-media';
import ProjectBadges from './project-badges';
import ProjectActions, { visibleActions } from './project-actions';

interface Props {
  project: ProjectCardDTO;
  lead?: boolean;
  eager?: boolean;
}

const ProjectCard: FC<Props> = ({ project, lead, eager }) => {
  const actions = visibleActions(project);
  const client = project.client && project.client !== project.title ? project.client : null;
  const meta = [client, project.timeframe].filter(Boolean) as string[];

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-stroke bg-bg-2 transition focus-within:border-primary/60 hover:border-text-1/30',
        lead && 'gap-6 p-5 sm:p-6 md:grid md:grid-cols-[1.15fr_1fr] md:items-center md:gap-8',
      )}
    >
      <ProjectMedia
        media={project.featuredMedia}
        aspect={lead ? 'aspect-[16/9]' : 'aspect-[16/10]'}
        eager={eager}
        fallbackLabel={project.title}
        className={cn(
          'transition duration-500 motion-safe:group-hover:scale-[1.02]',
          lead && 'rounded-xl border border-stroke/60',
        )}
      />

      <div className={cn('flex flex-1 flex-col gap-3', !lead && 'p-5 sm:p-6')}>
        <div className="flex flex-col gap-1.5">
          {meta.length > 0 && (
            <p className="text-[0.7rem] uppercase tracking-[0.14em] text-text-3">
              {meta.join(' · ')}
            </p>
          )}
          <h3
            className={cn(
              'font-display font-semibold leading-tight tracking-tight text-text-1',
              lead ? 'text-3xl md:text-4xl' : 'text-2xl md:text-[1.75rem]',
            )}
          >
            <Link
              href={`/work/${project.slug}`}
              className="inline-flex min-h-11 items-center after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {project.title}
              <span
                aria-hidden
                className="ml-2 inline-block text-primary transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </h3>
        </div>

        <p className="max-w-[60ch] text-sm leading-relaxed text-text-2">{project.summary}</p>

        <ProjectBadges project={project} label={`${project.title} platforms`} quiet />

        {actions.length > 0 && (
          <div className="relative z-raised mt-auto flex flex-wrap items-center gap-3 pt-2">
            <ProjectActions actions={actions.slice(0, 2)} />
          </div>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
