import type {
  CaptureJob,
  CaptureOutcome,
  CaptureAdapter,
  CaptureViewport,
  CaptureSourceType,
} from '@/types/project';

import { assertPublicHttpsUrl } from './safe-url';
import { resolveProvider, CaptureError } from './providers';

async function screenshotAdapter(
  job: CaptureJob,
  viewport: CaptureViewport = job.viewport,
): Promise<CaptureOutcome> {
  const check = await assertPublicHttpsUrl(job.sourceUrl);
  if (!check.ok) return { ok: false, reason: check.reason, retryable: false };

  const provider = resolveProvider();
  if (!provider) {
    return { ok: false, reason: 'No capture provider is configured', retryable: false };
  }

  try {
    const capture = await provider.screenshot(check.url.toString(), viewport);
    return { ok: true, capture, provider: provider.name };
  } catch (error) {
    if (error instanceof CaptureError) {
      return { ok: false, reason: error.message, retryable: error.retryable };
    }
    return {
      ok: false,
      reason: error instanceof Error ? error.message : 'Capture failed',
      retryable: true,
    };
  }
}

const ADAPTERS: CaptureAdapter[] = [
  { sourceType: 'website', capture: (job) => screenshotAdapter(job) },
  { sourceType: 'store-listing', capture: (job) => screenshotAdapter(job, { width: 900, height: 1400 }) },
  { sourceType: 'docs', capture: (job) => screenshotAdapter(job, { width: 1440, height: 1000 }) },
  { sourceType: 'repo-social', capture: (job) => screenshotAdapter(job, { width: 1280, height: 640 }) },
];

export function adapterFor(sourceType: CaptureSourceType): CaptureAdapter | null {
  return ADAPTERS.find((adapter) => adapter.sourceType === sourceType) ?? null;
}
