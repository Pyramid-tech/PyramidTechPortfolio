import type PgBoss from 'pg-boss';

import { getReferencedMediaPaths } from '@/lib/data/project';
import { storagePublicBase, listObjects, deleteObjects } from '@/lib/storage/supabaseStorage';
import { logger } from '@/lib/logger';

const JOB_NAME = 'cleanup-project-media';
const MEDIA_PREFIX = 'projects/';
const DAY_MS = 24 * 60 * 60 * 1000;

function retentionDays(): number {
  const n = Number(process.env.PROJECT_MEDIA_RETENTION_DAYS);
  return Number.isFinite(n) && n > 0 ? n : 7;
}

function timestampFromPath(path: string): number | null {
  const name = path.slice(path.lastIndexOf('/') + 1);
  const stamp = Number(name.split('-')[0]);
  return Number.isFinite(stamp) && stamp > 0 ? stamp : null;
}

export async function run() {
  logger.info('cleanup-project-media: started');

  const base = storagePublicBase();
  const referenced = await getReferencedMediaPaths();
  const usedPaths = new Set(
    referenced.filter((url) => url.startsWith(base)).map((url) => url.slice(base.length)),
  );

  const allFiles = await listObjects(MEDIA_PREFIX);
  const cutoff = Date.now() - retentionDays() * DAY_MS;

  const orphaned = allFiles.filter((path) => {
    if (!path.startsWith(MEDIA_PREFIX)) return false;
    if (usedPaths.has(path)) return false;
    const created = timestampFromPath(path);
    if (created === null) return false;
    return created < cutoff;
  });

  if (orphaned.length === 0) {
    logger.info('cleanup-project-media: no orphaned files past the retention window');
    return;
  }

  await deleteObjects(orphaned);
  logger.info(`cleanup-project-media: deleted ${orphaned.length} orphaned file(s)`, {
    context: { deleted: orphaned },
  });
}

export async function registerCleanupProjectMedia(boss: PgBoss): Promise<void> {
  await boss.createQueue(JOB_NAME);
  await boss.schedule(JOB_NAME, '30 0 * * *', {}, { tz: 'UTC' });
  await boss.work(JOB_NAME, run);
  logger.info('cleanup-project-media: scheduled (runs at 00:30 UTC)');
}
