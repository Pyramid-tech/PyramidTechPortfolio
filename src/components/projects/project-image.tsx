'use client';

import { FC, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import ProjectFallbackVisual from './project-fallback-visual';

interface Props {
  src: string | null;
  alt: string | null;
  className?: string;
  eager?: boolean;
  fallbackLabel?: string;
}

const ProjectImage: FC<Props> = ({ src, alt, className, eager, fallbackLabel }) => {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);

  if (!src || failed) return <ProjectFallbackVisual label={fallbackLabel} className={className} />;

  return (
    <img
      ref={ref}
      src={src}
      alt={alt ?? ''}
      aria-hidden={alt ? undefined : true}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('h-full w-full object-cover', className)}
    />
  );
};

export default ProjectImage;
