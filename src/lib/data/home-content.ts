import { client } from '@/sanity/lib/client';
import { withHomeContentFallback } from '@/lib/home-content-fallback';
import type { HomeContent } from '@/types/home-content';

const HOME_CONTENT_QUERY = `*[_type == "homePage"][0]{
  hero{ title, subtitle, ctaLabel, secondaryCtaLabel },
  about{ sectionTitle, paragraph, ctaLabel },
  services{ sectionTitle, cards[]{ title, description, tags } },
  work{ sectionTitle, intro, ctaLabel },
  approach{ sectionTitle, intro, cards[]{ title, description } },
  cta{ heading, paragraph, ctaLabel }
}`;

/**
 * Fetches the home-page copy from Sanity. Missing or empty fields are filled
 * from `HOME_CONTENT_FALLBACK` so the offer stays readable if the CMS is
 * unconfigured or a field is left blank. The `revalidate` cache serves the
 * last good response through transient blips.
 */
export async function getHomeContent(): Promise<HomeContent> {
  if (!client) return withHomeContentFallback({});

  try {
    const content = await client.fetch<HomeContent | null>(
      HOME_CONTENT_QUERY,
      {},
      { next: { revalidate: 60 } },
    );
    return withHomeContentFallback(content ?? {});
  } catch (error) {
    console.error('Failed to fetch home content from Sanity:', error);
    return withHomeContentFallback({});
  }
}
