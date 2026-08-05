import { FC } from 'react';

import type { ProjectCardDTO } from '@/types/project';

import ProjectCard from './project-card';

interface Props {
  projects: ProjectCardDTO[];
  leadFirst?: boolean;
}

const ProjectGrid: FC<Props> = ({ projects, leadFirst }) => {
  if (projects.length === 0) return null;

  const [first, ...rest] = projects;
  const showLead = Boolean(leadFirst) && projects.length > 1;

  if (!showLead) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} eager={i < 2} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="md:col-span-2">
        <ProjectCard project={first} lead eager />
      </div>
      {rest.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectGrid;
