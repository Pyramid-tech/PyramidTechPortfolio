import type PgBoss from 'pg-boss';

import type { CaptureJob } from '@/types/project';
import {
  MEDIA_CAPTURE_QUEUE,
  CAPTURE_MEDIA_PREFIX,
  mediaCaptureConfig,
} from '@/lib/media-capture/config';
import { adapterFor } from '@/lib/media-capture/adapters';
import { getCaptureMedia, markCaptureSucceeded, markCaptureFailed } from '@/lib/data/project';
import { uploadObject } from '@/lib/storage/supabaseStorage';
import { logger } from '@/lib/logger';

const seen = new Set<string>();

export async function runCapture(job: CaptureJob): Promise<void> {
  if (seen.has(job.idempotencyKey)) {
    logger.info('capture-project-media: duplicate job ignored', {
      context: { idempotencyKey: job.idempotencyKey },
    });
    return;
  }
  seen.add(job.idempotencyKey);

  const media = await getCaptureMedia(job.mediaId);
  if (!media) {
    logger.warning('capture-project-media: media no longer exists', {
      context: { mediaId: job.mediaId },
    });
    return;
  }

  const adapter = adapterFor(job.sourceType);
  if (!adapter) {
    await markCaptureFailed(job.mediaId, `No adapter for source type ${job.sourceType}`);
    return;
  }

  const outcome = await adapter.capture(job);

  if (!outcome.ok) {
    await markCaptureFailed(job.mediaId, outcome.reason);
    logger.warning('capture-project-media: capture failed', {
      context: { mediaId: job.mediaId, reason: outcome.reason, retryable: outcome.retryable },
    });
    if (outcome.retryable) throw new Error(outcome.reason);
    return;
  }

  const path = `${CAPTURE_MEDIA_PREFIX}/${job.projectId}/capture-${Date.now()}.${outcome.capture.extension}`;

  try {
    const url = await uploadObject(path, outcome.capture.body, outcome.capture.contentType);
    await markCaptureSucceeded(job.mediaId, url, outcome.provider);
    logger.info('capture-project-media: capture stored', {
      context: { mediaId: job.mediaId, provider: outcome.provider },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    await markCaptureFailed(job.mediaId, message);
    throw error;
  }
}

export async function registerCaptureProjectMedia(boss: PgBoss): Promise<void> {
  await boss.createQueue(MEDIA_CAPTURE_QUEUE, {
    name: MEDIA_CAPTURE_QUEUE,
    retryLimit: mediaCaptureConfig.maxRetries,
    retryDelay: 60,
    retryBackoff: true,
  });
  await boss.work<CaptureJob>(MEDIA_CAPTURE_QUEUE, async ([job]) => {
    await runCapture(job.data);
  });
  logger.info('capture-project-media: worker registered');
}
