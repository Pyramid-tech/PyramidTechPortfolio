import { FC } from 'react';

import type { ProjectCardDTO, ProjectPlatform, ProjectService } from '@/types/project';
import { ORIGIN_LABELS, LIFECYCLE_LABELS, PLATFORM_LABELS, SERVICE_LABELS } from '@/types/project';
import Badge, { type BadgeTone } from '@/components/ui/badge';

interface StatusBadge {
  key: string;
  label: string;
  tone: BadgeTone;
}

function cardStatusBadges(project: ProjectCardDTO): StatusBadge[] {
  const badges: StatusBadge[] = [];

  if (project.origin === 'demo' || project.origin === 'pyramid-product' || project.origin === 'open-source') {
    badges.push({ key: 'origin', label: ORIGIN_LABELS[project.origin], tone: 'brand' });
  }
  if (project.lifecycle === 'archived') {
    badges.push({ key: 'lifecycle', label: LIFECYCLE_LABELS.archived, tone: 'neutral' });
  }
  return badges;
}

export function detailStatusBadges(project: ProjectCardDTO): StatusBadge[] {
  return [{ key: 'origin', label: ORIGIN_LABELS[project.origin], tone: 'brand' }];
}

export const StatusBadges: FC<{ badges: StatusBadge[]; label?: string }> = ({ badges, label }) => {
  if (badges.length === 0) return null;

  return (
    <ul aria-label={label ?? 'Project status'} className="flex flex-wrap gap-1.5">
      {badges.map((badge) => (
        <li key={badge.key}>
          <Badge tone={badge.tone}>{badge.label}</Badge>
        </li>
      ))}
    </ul>
  );
};

export const PlatformTags: FC<{ platforms: ProjectPlatform[]; label?: string }> = ({
  platforms,
  label,
}) => {
  if (platforms.length === 0) return null;

  return (
    <ul aria-label={label ?? 'Platforms'} className="flex flex-wrap gap-1.5">
      {platforms.map((platform) => (
        <li key={platform}>
          <Badge tone="sky" variant="outline">
            {PLATFORM_LABELS[platform]}
          </Badge>
        </li>
      ))}
    </ul>
  );
};

export const ServiceTags: FC<{ services: ProjectService[]; label?: string }> = ({
  services,
  label,
}) => {
  if (services.length === 0) return null;

  return (
    <ul aria-label={label ?? 'Pyramid services'} className="flex flex-wrap gap-1.5">
      {services.map((service) => (
        <li key={service}>
          <Badge tone="emerald" variant="outline">
            {SERVICE_LABELS[service]}
          </Badge>
        </li>
      ))}
    </ul>
  );
};

const ProjectBadges: FC<{ project: ProjectCardDTO; label?: string; quiet?: boolean }> = ({
  project,
  label,
  quiet,
}) => {
  const status = cardStatusBadges(project);
  if (status.length === 0 && project.platforms.length === 0) return null;

  return (
    <ul aria-label={label ?? 'Project classification'} className="flex flex-wrap gap-1.5">
      {status.map((badge) => (
        <li key={badge.key}>
          <Badge tone={badge.tone} variant={quiet ? 'outline' : 'solid'}>
            {badge.label}
          </Badge>
        </li>
      ))}
      {project.platforms.map((platform) => (
        <li key={platform}>
          <Badge tone={quiet ? 'neutral' : 'sky'} variant="outline">
            {PLATFORM_LABELS[platform]}
          </Badge>
        </li>
      ))}
    </ul>
  );
};

export default ProjectBadges;
