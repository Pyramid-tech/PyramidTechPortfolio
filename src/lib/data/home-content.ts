import { client } from '@/sanity/lib/client';
import { withHomeContentFallback } from '@/lib/home-content-fallback';
import type { HomeContent } from '@/types/home-content';

const HOME_CONTENT_QUERY = `*[_type == "homePage"][0]{
  hero{ title, subtitle, ctaLabel },
  about{ sectionTitle, paragraph, ctaLabel },
  services{ sectionTitle, cards[]{ title, description, tags } },
  work{ sectionTitle, ctaLabel },
  approach{ sectionTitle, cards[]{ title, description } },
  cta{ heading, paragraph, ctaLabel }
}`;

/**
 * Fetches the home-page copy from Sanity (the source of truth for authored
 * copy). Structural labels listed in `HOME_CONTENT_FALLBACK` fall back to a
 * built-in default so the page never renders a blank heading when Sanity is
 * unconfigured, unreachable, or missing the field; authored prose has no
 * fallback and stays blank rather than showing fabricated copy. The
 * `revalidate` cache serves the last good response through transient blips.
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
