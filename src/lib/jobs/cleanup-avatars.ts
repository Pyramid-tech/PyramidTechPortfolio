import type PgBoss from 'pg-boss';
import { isNotNull } from 'drizzle-orm';
import { db } from '@/lib/db';
import { pyramidTeam } from '@/lib/db/schema/team';
import { storagePublicBase, listObjects, deleteObjects } from '@/lib/storage/supabaseStorage';
import { logger } from '@/lib/logger';

const JOB_NAME = 'cleanup-avatars';
const AVATAR_PREFIX = 'avatars/';

export async function run() {
  logger.info('cleanup-avatars: started');

  const rows = await db
    .select({ avatarUrl: pyramidTeam.avatarUrl })
    .from(pyramidTeam)
    .where(isNotNull(pyramidTeam.avatarUrl));

  const base = storagePublicBase();
  const usedPaths = new Set(
    rows
      .map((r) => r.avatarUrl)
      .filter((url): url is string => typeof url === 'string' && url.startsWith(base))
      .map((url) => url.slice(base.length)),
  );

  const allFiles = await listObjects(AVATAR_PREFIX);
  const orphaned = allFiles.filter((path) => !usedPaths.has(path));

  if (orphaned.length === 0) {
    logger.info('cleanup-avatars: no orphaned files found');
    return;
  }

  await deleteObjects(orphaned);
  logger.info(`cleanup-avatars: deleted ${orphaned.length} orphaned file(s)`, {
    context: { deleted: orphaned },
  });
}

export async function registerCleanupAvatars(boss: PgBoss): Promise<void> {
  await boss.schedule(JOB_NAME, '0 0 * * *', {}, { tz: 'UTC' });
  await boss.work(JOB_NAME, run);
  logger.info('cleanup-avatars: scheduled (runs at midnight UTC)');
}
