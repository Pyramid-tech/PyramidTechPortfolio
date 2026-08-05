import { FC } from 'react';

import type { ProjectCardDTO } from '@/types/project';
import { ORIGIN_LABELS, LIFECYCLE_LABELS, PLATFORM_LABELS } from '@/types/project';

const Chip: FC<{ children: string; tone?: 'default' | 'accent' }> = ({
  children,
  tone = 'default',
}) => (
  <li
    className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs ${
      tone === 'accent'
        ? 'border-primary/40 bg-primary/10 text-primary'
        : 'border-stroke text-text-1/60'
    }`}
  >
    {children}
  </li>
);

function contextLabel(project: ProjectCardDTO): string | null {
  if (project.origin === 'demo') return ORIGIN_LABELS.demo;
  if (project.origin === 'pyramid-product') return ORIGIN_LABELS['pyramid-product'];
  if (project.origin === 'open-source') return ORIGIN_LABELS['open-source'];
  if (project.lifecycle === 'archived') return LIFECYCLE_LABELS.archived;
  return null;
}

const ProjectBadges: FC<{ project: ProjectCardDTO; label?: string }> = ({ project, label }) => {
  const context = contextLabel(project);
  if (project.platforms.length === 0 && !context) return null;

  return (
    <ul aria-label={label ?? 'Project classification'} className="flex flex-wrap gap-1.5">
      {context && <Chip tone="accent">{context}</Chip>}
      {project.platforms.map((platform) => (
        <Chip key={platform}>{PLATFORM_LABELS[platform]}</Chip>
      ))}
    </ul>
  );
};

export default ProjectBadges;
