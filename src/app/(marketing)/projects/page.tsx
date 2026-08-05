import { Suspense } from 'react';
import type { Metadata } from 'next';

import Navigation from '@/components/navigation';
import { Footer } from '@/components/marketing';
import { ProjectGrid, ProjectGridSkeleton } from '@/components/projects';
import { getActiveProjects } from '@/lib/data/project';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Projects | Pyramid',
  description:
    'Selected work from Pyramid — websites, mobile and desktop applications, APIs, AI products and experiments.',
  alternates: { canonical: '/projects' },
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
      <Navigation />
      <main className="min-h-screen w-full bg-bg-1 py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <header className="mb-12 max-w-2xl sm:mb-16">
            <h1 className="font-display text-4xl font-extrabold leading-none md:text-6xl">
              Projects
            </h1>
            <p className="mt-4 text-base leading-relaxed text-text-1/60 md:text-lg">
              Work we have designed, built and shipped — products, platforms and experiments across
              web, mobile, backend and AI.
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
