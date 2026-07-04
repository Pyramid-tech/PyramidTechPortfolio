'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import { apiVersion, dataset, projectId } from '@/sanity/env';
import { schemaTypes } from '@/sanity/schemaTypes';
import { structure } from '@/sanity/structure';

export default defineConfig({
  basePath: '/studio',
  title: 'Pyramid Portfolio',
  // 'unconfigured' keeps the config valid before NEXT_PUBLIC_SANITY_PROJECT_ID
  // is set; the Studio simply won't connect until it is.
  projectId: projectId || 'a7go2cze', 
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    // GROQ playground inside the Studio, handy while trying Sanity out.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    // The home page is a singleton pinned in the structure; hide it from the
    // global "Create new document" menu so no second copy gets created.
    newDocumentOptions: (prev) => prev.filter((item) => item.templateId !== 'homePage'),
  },
});
