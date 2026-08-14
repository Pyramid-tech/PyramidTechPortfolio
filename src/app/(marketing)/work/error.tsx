'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Projects route error:', error.message);
  }, [error]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-bg-1 px-6 text-center">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Something went wrong</h1>
      <p className="max-w-md text-text-3">
        We could not load this page right now. Please try again in a moment.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-full border border-primary bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-bg-1"
        >
          Try again
        </button>
        <Link
          href="/work"
          className="rounded-full border border-stroke px-5 py-2.5 text-sm text-text-2 transition hover:border-text-1/50 hover:text-text-1"
        >
          All work
        </Link>
      </div>
    </main>
  );
}
