import { FC } from 'react';

import type { ProjectDetailDTO } from '@/types/project';
import {
  LIFECYCLE_LABELS,
  AVAILABILITY_LABELS,
  PLATFORM_LABELS,
  SERVICE_LABELS,
} from '@/types/project';

const ProjectFacts: FC<{ project: ProjectDetailDTO }> = ({ project }) => {
  const facts: { term: string; value: string }[] = [];

  if (project.client) facts.push({ term: 'Client', value: project.client });
  if (project.timeframe) facts.push({ term: 'Timeframe', value: project.timeframe });
  if (project.industry) facts.push({ term: 'Industry', value: project.industry });
  if (project.platforms.length > 0) {
    facts.push({
      term: 'Platforms',
      value: project.platforms.map((p) => PLATFORM_LABELS[p]).join(', '),
    });
  }
  if (project.services.length > 0) {
    facts.push({
      term: 'Pyramid services',
      value: project.services.map((s) => SERVICE_LABELS[s]).join(', '),
    });
  }
  facts.push({ term: 'Stage', value: LIFECYCLE_LABELS[project.lifecycle] });
  facts.push({ term: 'Availability', value: AVAILABILITY_LABELS[project.availability] });

  if (facts.length === 0) return null;

  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
      {facts.map((fact) => (
        <div key={fact.term} className="flex flex-col gap-1 border-t border-stroke/60 pt-3">
          <dt className="text-xs uppercase tracking-widest text-text-1/40">{fact.term}</dt>
          <dd className="text-sm text-text-1/80">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
};

export default ProjectFacts;
