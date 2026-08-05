import { FC } from 'react';

const ProjectGridSkeleton: FC<{ count?: number }> = ({ count = 4 }) => (
  <div aria-hidden className="grid animate-pulse grid-cols-1 gap-6 md:grid-cols-2">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="overflow-hidden rounded-2xl border border-stroke bg-bg-2">
        <div className="aspect-[16/10] w-full bg-bg-1" />
        <div className="flex flex-col gap-3 p-6">
          <div className="h-5 w-2/3 rounded bg-bg-1" />
          <div className="h-3.5 w-full rounded bg-bg-1" />
          <div className="h-3.5 w-4/5 rounded bg-bg-1" />
        </div>
      </div>
    ))}
  </div>
);

export default ProjectGridSkeleton;
