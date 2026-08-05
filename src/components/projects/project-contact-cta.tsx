import { FC } from 'react';
import Link from 'next/link';

import type { ProjectActionDTO } from '@/types/project';

import ProjectActions from './project-actions';

interface Props {
  actions: ProjectActionDTO[];
}

const ProjectContactCta: FC<Props> = ({ actions }) => {
  const primary = actions.filter((action) => action.isPrimary);

  return (
    <section className="border-t border-gray-1">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-6 py-20 text-center md:py-28">
        <h2 className="font-display text-3xl font-medium md:text-5xl lg:text-6xl">
          Have something like this in mind?
        </h2>
        <p className="mt-3 text-base leading-relaxed text-gray-300 md:text-lg">
          Tell us what you are building and we will map out how to get it shipped.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/book"
            className="rounded-full border border-primary bg-primary/10 px-6 py-3 text-sm font-medium text-primary transition hover:bg-primary hover:text-bg-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-1"
          >
            Start a project
          </Link>
          {primary.length > 0 && <ProjectActions actions={primary} size="md" />}
        </div>
      </div>
    </section>
  );
};

export default ProjectContactCta;
