import { Suspense } from 'react';
import type { Metadata } from 'next';

import { Footer } from '@/components/marketing';
import { ProjectGrid, ProjectGridSkeleton } from '@/components/projects';
import { getActiveProjects } from '@/lib/data/project';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Work | Pyramid',
  description:
    'Work from Pyramid — websites, mobile and desktop applications, APIs, AI products and experiments.',
  alternates: { canonical: '/work' },
};

async function ProjectArchive() {
  const projects = await getActiveProjects();

  if (projects.length === 0) {
    return <p className="text-text-1/40">Project case studies are on their way.</p>;
  }
  return <ProjectGrid projects={projects} />;
}

export default function ProjectsPage() {
  return (
    <>
      <main className="min-h-screen w-full bg-bg-1 py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <header className="mb-12 sm:mb-16">
            <h1 className="font-display text-4xl font-extrabold leading-none md:text-6xl">Work</h1>
            <p className="mt-4 text-base leading-relaxed text-text-1/60 md:text-lg">
              Designed, built and shipped: products, platforms and experiments across web, mobile,
              backend and AI.
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
