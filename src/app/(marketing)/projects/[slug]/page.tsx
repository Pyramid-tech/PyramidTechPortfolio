import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Navigation from '@/components/navigation';
import { Footer } from '@/components/marketing';
import {
  ProjectHero,
  ProjectSectionRenderer,
  AdjacentProjects,
  ProjectContactCta,
} from '@/components/projects';
import { visibleActions } from '@/components/projects/project-actions';
import { getActiveProjectBySlug, getAdjacentActiveProjects } from '@/lib/data/project';

export const dynamic = 'force-dynamic';

interface Params {
  params: { slug: string };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = await getActiveProjectBySlug(params.slug);
  if (!project) return { title: 'Project not found | Pyramid' };

  const image = project.featuredMedia?.url ?? project.featuredMedia?.posterUrl ?? undefined;

  return {
    title: `${project.title} | Pyramid`,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: 'article',
      title: project.title,
      description: project.summary,
      url: `/projects/${project.slug}`,
      images: image ? [{ url: image, alt: project.featuredMedia?.altText ?? project.title }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: project.title,
      description: project.summary,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: Params) {
  const project = await getActiveProjectBySlug(params.slug);
  if (!project) notFound();

  const { previous, next } = await getAdjacentActiveProjects(project.slug);

  return (
    <>
      <Navigation />
      <main className="min-h-screen w-full bg-bg-1">
        <ProjectHero project={project} />

        <section className="border-t border-gray-1 px-6 py-14 md:px-12 md:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 font-display text-2xl font-semibold text-text-1 md:text-3xl">
              Overview
            </h2>
            <div className="max-w-3xl">
              {project.overview
                .split(/\n\s*\n/)
                .map((paragraph) => paragraph.trim())
                .filter(Boolean)
                .map((paragraph, i) => (
                  <p
                    key={i}
                    className="mb-4 text-base leading-relaxed text-text-1/75 last:mb-0 md:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
            </div>
          </div>
        </section>

        <ProjectSectionRenderer sections={project.sections} />

        <AdjacentProjects previous={previous} next={next} />
        <ProjectContactCta actions={visibleActions(project)} />
      </main>
      <Footer />
    </>
  );
}
