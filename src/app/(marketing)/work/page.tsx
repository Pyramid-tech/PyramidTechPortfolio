import { Suspense } from 'react';
import type { Metadata } from 'next';

import { Footer } from '@/components/marketing';
import { ProjectGrid, ProjectGridSkeleton } from '@/components/projects';
import SectionTitle from '@/components/ui/section-title';
import { getActiveProjects } from '@/lib/data/project';
import { withDbRetry } from '@/lib/db/retry';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Work from Pyramid: websites, mobile and desktop applications, and the platforms behind them.',
  alternates: { canonical: '/work' },
};

async function ProjectArchive() {
  const projects = await withDbRetry(getActiveProjects);

  if (projects.length === 0) {
    return <p className="text-text-3">Project case studies are on their way.</p>;
  }
  return <ProjectGrid projects={projects} />;
}

export default function ProjectsPage() {
  return (
    <>
      <main className="min-h-screen w-full bg-bg-1 py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <header className="mb-12 sm:mb-16">
            <SectionTitle as="h1" title="WORK." />
            <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-text-2 md:text-lg">
              Designed, built and shipped: products across web, mobile, desktop, and backend.
            </p>
          </header>

          <Suspense fallback={<ProjectGridSkeleton />}>
            <ProjectArchive />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
