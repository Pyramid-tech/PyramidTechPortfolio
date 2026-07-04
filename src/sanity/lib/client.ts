import { createClient } from 'next-sanity';

import { apiVersion, dataset, isSanityConfigured, projectId } from '../env';

export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // Serve published content from Sanity's CDN; edits go live on the next
      // request without a rebuild (the home page is force-dynamic).
      useCdn: true,
    })
  : null;
