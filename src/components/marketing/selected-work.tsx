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
}

const SelectedWork: FC<Props> = ({ content, projects }) => {
  if (projects.length === 0) return null;

  const sectionTitle = content?.sectionTitle?.trim() || HOME_CONTENT_FALLBACK.work.sectionTitle;
  const ctaLabel = content?.ctaLabel?.trim() || HOME_CONTENT_FALLBACK.work.ctaLabel;

  return (
    <section id="work" className="border-t border-gray-1 py-16 md:py-24">
      <div className="px-6 md:px-12">
        <SectionTitle title={sectionTitle} />
        {content?.intro?.trim() ? (
          <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-text-2 md:text-lg">
            {content.intro}
          </p>
        ) : null}

        <div className="mt-10 md:mt-14">
          <ProjectGrid projects={projects} leadFirst />
        </div>

        <div className="mt-10 flex justify-start">
          <Link
            href="/work"
            className="group inline-flex min-h-11 items-center gap-1.5 text-sm text-text-1 transition hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:text-base"
          >
            {ctaLabel}
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SelectedWork;
