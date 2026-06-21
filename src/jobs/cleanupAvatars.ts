import type PgBoss from 'pg-boss';
import { isNotNull } from 'drizzle-orm';
import { db } from '@/lib/db';
import { pyramidTeam } from '@/modules/team/infrastructure/models/PyramidTeam';
import { logger } from '@/shared/logger';

const JOB_NAME = 'cleanup-avatars';
const BUCKET = 'public_pyramid';
const AVATAR_PREFIX = 'avatars/';

async function listBucketFiles(): Promise<string[]> {
  const res = await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prefix: AVATAR_PREFIX, limit: 1000 }),
  });
  if (!res.ok) throw new Error(`List bucket failed: ${await res.text()}`);
  const files: { name: string }[] = await res.json();
  return files.map((f) => `${AVATAR_PREFIX}${f.name}`);
}

async function deleteFiles(paths: string[]): Promise<void> {
  const res = await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/${BUCKET}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prefixes: paths }),
  });
  if (!res.ok) throw new Error(`Delete files failed: ${await res.text()}`);
}

export async function run() {
  logger.info('cleanup-avatars: started');

  const rows = await db
    .select({ avatarUrl: pyramidTeam.avatarUrl })
    .from(pyramidTeam)
    .where(isNotNull(pyramidTeam.avatarUrl));

  const baseUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;
  const usedPaths = new Set(
    rows
      .map((r) => r.avatarUrl)
      .filter((url): url is string => typeof url === 'string' && url.startsWith(baseUrl))
      .map((url) => url.slice(baseUrl.length)),
  );

  const allFiles = await listBucketFiles();
  const orphaned = allFiles.filter((path) => !usedPaths.has(path));

  if (orphaned.length === 0) {
    logger.info('cleanup-avatars: no orphaned files found');
    return;
  }

  await deleteFiles(orphaned);
  logger.info(`cleanup-avatars: deleted ${orphaned.length} orphaned file(s)`, {
    context: { deleted: orphaned },
  });
}

export async function registerCleanupAvatars(boss: PgBoss): Promise<void> {
  await boss.schedule(JOB_NAME, '0 0 * * *', {}, { tz: 'UTC' });
  await boss.work(JOB_NAME, run);
  logger.info('cleanup-avatars: scheduled (runs at midnight UTC)');
}
