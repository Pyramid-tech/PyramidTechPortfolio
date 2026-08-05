function intFromEnv(raw: string | undefined, fallback: number): number {
  if (raw === undefined || raw.trim() === '') return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export const MEDIA_CAPTURE_QUEUE = 'capture-project-media';

export const CAPTURE_MEDIA_PREFIX = 'projects';

export const mediaCaptureConfig = {
  timeoutMs: intFromEnv(process.env.CAPTURE_TIMEOUT_MS, 30000),
  maxBytes: intFromEnv(process.env.CAPTURE_MAX_BYTES, 10 * 1024 * 1024),
  maxRetries: intFromEnv(process.env.CAPTURE_MAX_RETRIES, 2),
  driver: process.env.CAPTURE_DRIVER ?? 'http',
  httpEndpoint: process.env.CAPTURE_HTTP_ENDPOINT ?? '',
  httpApiKey: process.env.CAPTURE_HTTP_API_KEY ?? '',
  httpUrlParam: process.env.CAPTURE_HTTP_URL_PARAM ?? 'url',
} as const;
