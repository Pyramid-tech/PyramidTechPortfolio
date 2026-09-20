import { unstable_cache } from 'next/cache';

import { getActiveTeamCount } from '@/lib/data/team';
import { getActiveProjectCount } from '@/lib/data/project';
import { NAV_COUNTS_TAG } from '@/lib/data/cache-tags';
import { resilient } from '@/lib/data/resilient';

export type NavCounts = { hasTeam: boolean; projectCount: number };

const FALLBACK: NavCounts = { hasTeam: true, projectCount: 1 };

const loadNavCounts = unstable_cache(
  async (): Promise<NavCounts> => {
    const [team, projectCount] = await Promise.all([getActiveTeamCount(), getActiveProjectCount()]);
    return { hasTeam: team.hasTeam, projectCount };
  },
  ['nav-counts'],
  { revalidate: 300, tags: [NAV_COUNTS_TAG] },
);

export function getNavCounts(): Promise<NavCounts> {
  return resilient('nav-counts', loadNavCounts, FALLBACK);
}
