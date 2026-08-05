import { FC } from 'react';

import type { ProjectCardDTO } from '@/types/project';

import ProjectCard from './project-card';

interface Props {
  projects: ProjectCardDTO[];
  leadFirst?: boolean;
}

const ProjectGrid: FC<Props> = ({ projects, leadFirst }) => {
  if (projects.length === 0) return null;

  const showLead = Boolean(leadFirst) && projects.length !== 2;
  const [first] = projects;
  const rest = showLead ? projects.slice(1) : projects;
  const stretchLast = rest.length % 2 === 1;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {showLead && (
        <div className="md:col-span-2">
          <ProjectCard project={first} lead eager />
        </div>
      )}

      {rest.map((project, i) => {
        const eager = !showLead && i < 2;

        if (stretchLast && i === rest.length - 1) {
          return (
            <div key={project.id} className="md:col-span-2">
              <ProjectCard project={project} lead eager={eager} />
            </div>
          );
        }
        return <ProjectCard key={project.id} project={project} eager={eager} />;
      })}
    </div>
  );
};

export default ProjectGrid;
