import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Footer } from '@/components/marketing';
import { PolicyDocument } from '@/components/projects';
import { getProjectPrivacyPolicy } from '@/lib/data/project';
import { withDbRetry } from '@/lib/db/retry';

export const revalidate = 300;

interface Params {
  params: { slug: string };
}

const getPolicy = cache((slug: string) => withDbRetry(() => getProjectPrivacyPolicy(slug)));

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const policy = await getPolicy(params.slug);
  if (!policy) return { title: 'Privacy policy not found' };

  return {
    title: `${policy.title} Privacy Policy`,
    description: `How the ${policy.title} app collects, uses and protects your information.`,
    alternates: { canonical: `/work/${policy.slug}/privacy` },
    robots: { index: false, follow: false },
  };
}

export default async function ProjectPrivacyPage({ params }: Params) {
  const policy = await getPolicy(params.slug);
  if (!policy) notFound();

  return (
    <>
      <main className="min-h-screen w-full bg-bg-1">
        <article className="mx-auto max-w-3xl px-6 pb-20 pt-28 md:px-12 md:pb-28 md:pt-36">
          <header className="mb-10 flex flex-col gap-4 border-b border-gray-1 pb-10">
            <p className="text-xs uppercase tracking-[0.14em] text-primary">Privacy policy</p>
            <h1 className="font-display text-4xl font-extrabold leading-none text-text-1 md:text-6xl">
              {policy.title} Privacy Policy
            </h1>
            {policy.updatedAt && (
              <p className="text-sm text-text-3">
                Last updated{' '}
                <time dateTime={policy.updatedAt.toISOString()}>
                  {dateFormat.format(policy.updatedAt)}
                </time>
              </p>
            )}
          </header>

          <PolicyDocument source={policy.body} />
        </article>
      </main>
      <Footer />
    </>
  );
}
