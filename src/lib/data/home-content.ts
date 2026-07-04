import { client } from '@/sanity/lib/client';
import type { HomeContent } from '@/types/home-content';

const HOME_CONTENT_QUERY = `*[_type == "homePage"][0]{
  hero{ title, subtitle, ctaLabel },
  about{ sectionTitle, paragraph, ctaLabel },
  services{ sectionTitle, cards[]{ title, description, tags } },
  approach{ sectionTitle, cards[]{ title, description } },
  cta{ heading, paragraph, ctaLabel }
}`;

/**
 * Fetches the home-page copy from Sanity (the single source of truth). Returns
 * an empty object — never fabricated copy — when Sanity is unconfigured or
 * unreachable, so components render blank rather than stale hardcoded text.
 * The `revalidate` cache serves the last good response through transient blips.
 */
export async function getHomeContent(): Promise<HomeContent> {
  if (!client) return {};

  try {
    const content = await client.fetch<HomeContent | null>(
      HOME_CONTENT_QUERY,
      {},
      { next: { revalidate: 60 } },
    );
    return content ?? {};
  } catch (error) {
    console.error('Failed to fetch home content from Sanity:', error);
    return {};
  }
}
