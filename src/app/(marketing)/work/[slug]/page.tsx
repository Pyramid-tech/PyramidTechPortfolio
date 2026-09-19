import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Footer } from '@/components/marketing';
import { WhatsAppTopic } from '@/components/marketing/whatsapp';
import {
  ProjectHero,
  ProjectMedia,
  ProjectSectionRenderer,
  AdjacentProjects,
  ProjectContactCta,
} from '@/components/projects';
import { visibleActions } from '@/components/projects/project-actions';
import { getActiveProjectSlugs, getAdjacentActiveProjects } from '@/lib/data/project';
import { getProjectForPage } from '@/lib/data/project-cached';
import { resilient } from '@/lib/data/resilient';
import { withDbRetry } from '@/lib/db/retry';
import { cn } from '@/lib/utils';

export const revalidate = 300;

interface Params {
  params: { slug: string };
}

export async function generateStaticParams(): Promise<Params['params'][]> {
  const projects = await resilient('work:static-params', getActiveProjectSlugs, []);
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = await getProjectForPage(params.slug);
  if (!project) return { title: 'Project not found' };

  const image = project.featuredMedia?.url ?? project.featuredMedia?.posterUrl ?? undefined;

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: 'article',
      title: project.title,
      description: project.summary,
      url: `/work/${project.slug}`,
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
  const project = await getProjectForPage(params.slug);
  if (!project) notFound();

  const { previous, next } = await withDbRetry(() => getAdjacentActiveProjects(project.slug));

  const overviewParagraphs = project.overview
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <main className="min-h-screen w-full bg-bg-1">
        <ProjectHero project={project} />

        <section className="border-t border-gray-1 px-6 py-14 md:px-12 md:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 font-display text-2xl font-semibold text-text-1 md:text-3xl">
              Overview
            </h2>
            <div className="max-w-3xl lg:max-w-none lg:flow-root">
              {project.featuredMedia && (
                <figure className="hidden lg:float-right lg:mb-5 lg:ml-9 lg:block lg:w-[42%]">
                  <div className="overflow-hidden rounded-xl border border-stroke">
                    <ProjectMedia media={project.featuredMedia} aspect="aspect-[16/10]" eager />
                  </div>
                  {project.featuredMedia.caption && (
                    <figcaption className="mt-2 text-xs leading-relaxed text-text-3">
                      {project.featuredMedia.caption}
                    </figcaption>
                  )}
                </figure>
              )}

              {overviewParagraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className={cn(
                    'mb-4 text-base leading-relaxed text-text-2 last:mb-0 md:text-lg lg:mb-0',
                    i === 0
                      ? 'lg:first-letter:float-left lg:first-letter:mr-3 lg:first-letter:mt-1 lg:first-letter:font-display lg:first-letter:text-6xl lg:first-letter:font-bold lg:first-letter:leading-[0.8] lg:first-letter:text-primary'
                      : 'lg:indent-8',
                  )}
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
      <WhatsAppTopic project={project.title} />
    </>
  );
}
