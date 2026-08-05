import { FC } from 'react';
import Link from 'next/link';

import type { HomeContent } from '@/types/home-content';
import type { ProjectCardDTO } from '@/types/project';
import { HOME_CONTENT_FALLBACK } from '@/lib/home-content-fallback';
import SectionTitle from '@/components/ui/section-title';
import { ProjectGrid } from '@/components/projects';

interface Props {
  content?: HomeContent['work'];
  projects: ProjectCardDTO[];
  totalCount: number;
}

const SelectedWork: FC<Props> = ({ content, projects, totalCount }) => {
  if (projects.length === 0) return null;

  const sectionTitle = content?.sectionTitle?.trim() || HOME_CONTENT_FALLBACK.work.sectionTitle;
  const ctaLabel = content?.ctaLabel?.trim() || HOME_CONTENT_FALLBACK.work.ctaLabel;

  return (
    <section id="work" className="border-t border-gray-1 py-16 md:py-24">
      <SectionTitle title={sectionTitle} classes="px-6 pt-8 md:px-12" />

      <div className="px-6 pt-10 md:px-12">
        <ProjectGrid projects={projects} leadFirst />

        {totalCount > projects.length && (
          <div className="mt-10 flex justify-end">
            <Link
              href="/work"
              className="group inline-flex items-center gap-1.5 text-sm text-text-1 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:text-base"
            >
              {ctaLabel}
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default SelectedWork;
