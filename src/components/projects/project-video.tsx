'use client';

import { FC, useState } from 'react';

import { usePrefersReducedMotion } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

import ProjectImage from './project-image';

interface Props {
  src: string;
  posterUrl: string | null;
  description: string | null;
  className?: string;
  autoPlay?: boolean;
}

const ProjectVideo: FC<Props> = ({ src, posterUrl, description, className, autoPlay }) => {
  const reducedMotion = usePrefersReducedMotion();
  const [failed, setFailed] = useState(false);

  if (failed) return <ProjectImage src={posterUrl} alt={description} className={className} />;

  const shouldAutoPlay = Boolean(autoPlay) && !reducedMotion;

  return (
    <video
      src={src}
      poster={posterUrl ?? undefined}
      controls
      muted
      playsInline
      loop={shouldAutoPlay}
      autoPlay={shouldAutoPlay}
      preload="none"
      aria-label={description ?? undefined}
      onError={() => setFailed(true)}
      className={cn('h-full w-full object-cover', className)}
    />
  );
};

export default ProjectVideo;
