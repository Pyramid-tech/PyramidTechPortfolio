import { FC } from 'react';

import type { ProjectActionDTO, ProjectCardDTO } from '@/types/project';

function isExternal(url: string): boolean {
  return url.startsWith('http');
}

export function visibleActions(project: {
  actions?: ProjectActionDTO[];
  primaryAction?: ProjectActionDTO | null;
  lifecycle: ProjectCardDTO['lifecycle'];
}): ProjectActionDTO[] {
  const all = project.actions ?? (project.primaryAction ? [project.primaryAction] : []);
  if (project.lifecycle !== 'archived') return all;
  return all.filter((action) => action.kind === 'source-code' || action.kind === 'contact');
}

interface Props {
  actions: ProjectActionDTO[];
  size?: 'sm' | 'md';
}

const ProjectActions: FC<Props> = ({ actions, size = 'sm' }) => {
  if (actions.length === 0) return null;

  const padding = size === 'md' ? 'px-5 py-2.5 text-sm' : 'px-3 py-1.5 text-xs';

  return (
    <ul className="flex flex-wrap gap-2">
      {actions.map((action) => {
        const external = isExternal(action.url);
        return (
          <li key={action.id}>
            <a
              href={action.url}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className={`inline-flex items-center gap-1.5 rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-1 ${padding} ${
                action.isPrimary
                  ? 'border-primary bg-primary/10 text-primary hover:bg-primary hover:text-bg-1'
                  : 'border-stroke text-text-1/70 hover:border-text-1/50 hover:text-text-1'
              }`}
            >
              {action.label}
              {external && (
                <>
                  <span aria-hidden>↗</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default ProjectActions;
