import { FC } from 'react';
import Link from 'next/link';

import type { ProjectCardDTO } from '@/types/project';
import SectionTitle from '@/components/ui/section-title';
import { ProjectGrid } from '@/components/projects';

interface Props {
  projects: ProjectCardDTO[];
  totalCount: number;
}

const SelectedWork: FC<Props> = ({ projects, totalCount }) => {
  if (projects.length === 0) return null;

  return (
    <section id="work" className="border-t border-gray-1 py-16 md:py-24">
      <SectionTitle title="Selected Work" classes="px-6 pt-8 md:px-12" />

      <div className="px-6 pt-10 md:px-12">
        <ProjectGrid projects={projects} leadFirst />

        {totalCount > projects.length && (
          <div className="mt-10 flex justify-end">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-1.5 text-sm text-text-1 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:text-base"
            >
              View all projects
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default SelectedWork;
