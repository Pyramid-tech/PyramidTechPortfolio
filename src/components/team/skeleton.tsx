import { FC } from 'react';

const SkeletonCard: FC = () => (
  <div className="flex w-full flex-col gap-3">
    {/* avatar */}
    <div className="aspect-square w-full rounded-xl bg-bg-2" />

    <div className="flex flex-col gap-2">
      {/* name */}
      <div className="h-4 w-3/4 rounded bg-bg-2" />
      {/* job title */}
      <div className="h-3 w-1/2 rounded bg-bg-2" />
      {/* description */}
      <div className="mt-1 flex flex-col gap-1.5">
        <div className="h-3 w-full rounded bg-bg-2" />
        <div className="h-3 w-5/6 rounded bg-bg-2" />
        <div className="h-3 w-2/3 rounded bg-bg-2" />
      </div>
    </div>

    {/* icons */}
    <div className="mt-1 flex items-center gap-3">
      <div className="h-5 w-5 rounded bg-bg-2" />
      <div className="h-5 w-5 rounded bg-bg-2" />
    </div>
  </div>
);

const TeamSkeleton: FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="mx-auto max-w-6xl px-4 sm:px-6">
    <div className="mb-12 text-center sm:mb-16">
      <h1 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">Our Team</h1>
      <p className="mt-2 text-sm text-gray-400 sm:text-base">The people behind Pyramid.</p>
    </div>

    <div className="grid animate-pulse grid-cols-[repeat(auto-fit,minmax(140px,200px))] justify-center gap-x-8 gap-y-12">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

export default TeamSkeleton;
