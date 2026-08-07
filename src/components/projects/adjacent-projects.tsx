import { FC } from 'react';
import Link from 'next/link';

import type { AdjacentProject } from '@/lib/data/project';

interface Props {
  previous: AdjacentProject | null;
  next: AdjacentProject | null;
}

const AdjacentLink: FC<{ project: AdjacentProject; direction: 'previous' | 'next' }> = ({
  project,
  direction,
}) => (
  <Link
    href={`/work/${project.slug}`}
    rel={direction === 'previous' ? 'prev' : 'next'}
    className={`group flex flex-col gap-1 rounded-xl border border-stroke p-5 transition hover:border-text-1/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
      direction === 'next' ? 'sm:items-end sm:text-right' : ''
    }`}
  >
    <span className="text-xs uppercase tracking-widest text-text-1/40">
      {direction === 'previous' ? 'Previous project' : 'Next project'}
    </span>
    <span className="font-display text-lg font-semibold text-text-1 transition group-hover:text-text-strong">
      {project.title}
    </span>
  </Link>
);

const AdjacentProjects: FC<Props> = ({ previous, next }) => {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="More projects"
      className="grid grid-cols-1 gap-4 border-t border-gray-1 px-6 py-12 sm:grid-cols-2 md:px-12"
    >
      {previous ? <AdjacentLink project={previous} direction="previous" /> : <div />}
      {next && <AdjacentLink project={next} direction="next" />}
    </nav>
  );
};

export default AdjacentProjects;
