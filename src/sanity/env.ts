export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2025-01-01';

/**
 * Read once at module load; nothing here throws when the env vars are absent,
 * so the app can build and boot before Sanity is set up. `client` is null in
 * that case and the home page renders with no content until it's configured.
 */
export const isSanityConfigured = projectId.length > 0;
