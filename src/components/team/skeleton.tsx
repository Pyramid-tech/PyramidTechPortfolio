import { FC } from 'react';

import SectionTitle from '@/components/ui/section-title';

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

const TeamSkeleton: FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="mx-auto max-w-6xl px-6 md:px-12">
    <header className="mb-12 sm:mb-16">
      <SectionTitle as="h1" title="TEAM." />
      <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-text-2 md:text-lg">
        The engineers and designers who build the work. Small on purpose, so the people who scope
        your project are the people who ship it.
      </p>
    </header>

    <div className="grid animate-pulse grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

export default TeamSkeleton;
