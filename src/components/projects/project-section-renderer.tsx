import { FC } from 'react';

import type { ProjectSectionDTO, SectionPayload } from '@/types/project';

import ProjectImage from './project-image';
import ProjectVideo from './project-video';
import ProjectEmbed from './project-embed';

const Paragraphs: FC<{ paragraphs: string[]; className?: string }> = ({
  paragraphs,
  className,
}) => (
  <div className={className}>
    {paragraphs.map((paragraph, i) => (
      <p key={i} className="mb-4 text-base leading-relaxed text-text-2 last:mb-0 md:text-lg">
        {paragraph}
      </p>
    ))}
  </div>
);

const Figure: FC<{ url: string; alt: string | null; caption?: string | null }> = ({
  url,
  alt,
  caption,
}) => (
  <figure>
    <div className="overflow-hidden rounded-2xl border border-stroke bg-bg-2">
      <ProjectImage src={url} alt={alt} className="w-full object-cover" />
    </div>
    {caption && <figcaption className="mt-2 text-xs text-text-3">{caption}</figcaption>}
  </figure>
);

const PayloadRenderer: FC<{ payload: SectionPayload }> = ({ payload }) => {
  switch (payload.type) {
    case 'rich-text':
      return <Paragraphs paragraphs={payload.paragraphs} className="max-w-3xl" />;

    case 'full-media':
    case 'diagram':
      return (
        <Figure
          url={payload.media.url}
          alt={payload.media.altText}
          caption={payload.media.caption}
        />
      );

    case 'split':
      return (
        <div
          className={`grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 ${
            payload.mediaSide === 'left' ? 'md:[&>*:first-child]:order-2' : ''
          }`}
        >
          <Paragraphs paragraphs={payload.paragraphs} />
          <Figure
            url={payload.media.url}
            alt={payload.media.altText}
            caption={payload.media.caption}
          />
        </div>
      );

    case 'gallery':
      return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {payload.items.map((item, i) => (
            <Figure key={i} url={item.url} alt={item.altText} caption={item.caption} />
          ))}
        </div>
      );

    case 'video':
      return (
        <div className="aspect-video overflow-hidden rounded-2xl border border-stroke bg-bg-2">
          <ProjectVideo
            src={payload.url}
            posterUrl={payload.posterUrl}
            description={payload.altText}
          />
        </div>
      );

    case 'features':
      return (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {payload.items.map((item, i) => (
            <li key={i} className="border-t border-stroke/60 pt-4">
              <p className="font-medium text-text-1">{item.title}</p>
              {item.description && (
                <p className="mt-1.5 text-sm leading-relaxed text-text-3">{item.description}</p>
              )}
            </li>
          ))}
        </ul>
      );

    case 'metrics':
      return (
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {payload.items.map((item, i) => (
            <div key={i} className="border-t border-stroke/60 pt-4">
              <dt className="sr-only">{item.label}</dt>
              <dd>
                <span className="block font-display text-4xl font-extrabold text-primary md:text-5xl">
                  {item.value}
                </span>
                <span className="mt-2 block text-sm text-text-3">{item.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      );

    case 'quote':
      return (
        <figure className="max-w-3xl border-l-2 border-primary pl-6">
          <blockquote className="font-display text-xl leading-relaxed text-text-1 md:text-2xl">
            “{payload.quote}”
          </blockquote>
          {(payload.attribution || payload.role) && (
            <figcaption className="mt-4 text-sm text-text-3">
              {[payload.attribution, payload.role].filter(Boolean).join(' · ')}
            </figcaption>
          )}
        </figure>
      );

    case 'tech':
      return (
        <ul className="flex flex-wrap gap-2">
          {payload.items.map((item) => (
            <li
              key={item}
              className="rounded-full border border-stroke px-3 py-1.5 text-sm text-text-2"
            >
              {item}
            </li>
          ))}
        </ul>
      );

    case 'embed':
      return <ProjectEmbed provider={payload.provider} url={payload.url} title={payload.title} />;
  }
};

const ProjectSectionRenderer: FC<{ sections: ProjectSectionDTO[] }> = ({ sections }) => {
  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => (
        <section key={section.id} className="border-t border-gray-1 px-6 py-14 md:px-12 md:py-20">
          <div className="mx-auto max-w-6xl">
            {section.heading && (
              <h2 className="mb-8 font-display text-2xl font-semibold text-text-1 md:text-3xl">
                {section.heading}
              </h2>
            )}
            <PayloadRenderer payload={section.payload} />
          </div>
        </section>
      ))}
    </>
  );
};

export default ProjectSectionRenderer;
