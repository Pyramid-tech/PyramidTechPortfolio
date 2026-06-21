import { FC } from 'react';

const SkeletonCard: FC = () => (
  <div className="flex flex-col gap-[1vw] md:gap-[2vw]">
    {/* avatar */}
    <div className="h-[16vw] w-full rounded-[0.5vw] bg-bg-2 md:h-[38vw]" />

    <div className="flex flex-col gap-[0.4vw] md:gap-[1vw]">
      {/* name */}
      <div className="h-[1.4vw] w-3/4 rounded bg-bg-2 md:h-[3vw]" />
      {/* job title */}
      <div className="h-[1.1vw] w-1/2 rounded bg-bg-2 md:h-[2.2vw]" />
      {/* description */}
      <div className="mt-[0.2vw] flex flex-col gap-[0.4vw]">
        <div className="h-[0.95vw] w-full rounded bg-bg-2 md:h-[1.9vw]" />
        <div className="h-[0.95vw] w-5/6 rounded bg-bg-2 md:h-[1.9vw]" />
        <div className="h-[0.95vw] w-2/3 rounded bg-bg-2 md:h-[1.9vw]" />
      </div>
    </div>

    {/* icons */}
    <div className="mt-auto flex items-center gap-[0.8vw] md:gap-[2vw]">
      <div className="h-[1.2vw] w-[1.2vw] rounded-sm bg-bg-2 md:h-[2.5vw] md:w-[2.5vw]" />
      <div className="h-[1.2vw] w-[1.2vw] rounded-sm bg-bg-2 md:h-[2.5vw] md:w-[2.5vw]" />
    </div>
  </div>
);

const TeamSkeleton: FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="mx-auto max-w-[80vw] px-[4vw] md:max-w-[90vw]">
    <div className="mb-[4vw]">
      <h1 className="text-center text-[3.5vw] font-bold leading-[100%] md:text-[4.6vw]">Our Team</h1>
      <p className="mt-[1vw] text-center text-[1.3vw] text-gray-400 md:text-[2vw]">The people behind Pyramid.</p>
    </div>

    <div className="animate-pulse">
      <div className="grid grid-cols-5 gap-[2vw] md:grid-cols-2 md:gap-[5vw]">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  </div>
);

export default TeamSkeleton;
