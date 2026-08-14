import { FC, ReactNode } from 'react';

import type { ProjectDetailDTO } from '@/types/project';
import { LIFECYCLE_LABELS, AVAILABILITY_LABELS } from '@/types/project';

import { PlatformTags, ServiceTags } from './project-badges';

const Fact: FC<{ term: string; children: ReactNode }> = ({ term, children }) => (
  <div className="flex flex-col gap-1.5 border-t border-stroke/60 pt-3">
    <dt className="text-xs uppercase tracking-widest text-text-3">{term}</dt>
    <dd className="text-sm text-text-2">{children}</dd>
  </div>
);

const ProjectFacts: FC<{ project: ProjectDetailDTO }> = ({ project }) => (
  <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
    {project.client && <Fact term="Client">{project.client}</Fact>}
    {project.timeframe && <Fact term="Timeframe">{project.timeframe}</Fact>}
    {project.industry && <Fact term="Industry">{project.industry}</Fact>}

    {project.platforms.length > 0 && (
      <Fact term="Platforms">
        <PlatformTags platforms={project.platforms} label="Platforms" />
      </Fact>
    )}

    {project.services.length > 0 && (
      <Fact term="Pyramid services">
        <ServiceTags services={project.services} label="Pyramid services" />
      </Fact>
    )}

    <Fact term="Stage">{LIFECYCLE_LABELS[project.lifecycle]}</Fact>
    <Fact term="Availability">
      <span className={project.availability === 'public' ? undefined : 'text-warning'}>
        {AVAILABILITY_LABELS[project.availability]}
      </span>
    </Fact>
  </dl>
);

export default ProjectFacts;
