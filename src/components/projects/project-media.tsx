import { FC } from 'react';

import type { ProjectMediaDTO } from '@/types/project';
import { cn } from '@/lib/utils';

import ProjectImage from './project-image';
import ProjectVideo from './project-video';
import ProjectFallbackVisual from './project-fallback-visual';

interface Props {
  media: ProjectMediaDTO | null;
  aspect?: string;
  className?: string;
  eager?: boolean;
  fallbackLabel?: string;
}

const ProjectMedia: FC<Props> = ({
  media,
  aspect = 'aspect-[16/10]',
  className,
  eager,
  fallbackLabel,
}) => (
  <div className={cn('relative w-full overflow-hidden bg-bg-2', aspect, className)}>
    {!media ? (
      <ProjectFallbackVisual label={fallbackLabel} />
    ) : media.kind === 'video' || media.kind === 'animation' ? (
      media.url ? (
        <ProjectVideo
          src={media.url}
          posterUrl={media.posterUrl}
          description={media.altText}
          autoPlay={media.kind === 'animation'}
        />
      ) : (
        <ProjectImage
          src={media.posterUrl}
          alt={media.altText}
          eager={eager}
          fallbackLabel={fallbackLabel}
        />
      )
    ) : (
      <ProjectImage
        src={media.url ?? media.posterUrl}
        alt={media.altText}
        eager={eager}
        fallbackLabel={fallbackLabel}
      />
    )}
  </div>
);

export default ProjectMedia;
