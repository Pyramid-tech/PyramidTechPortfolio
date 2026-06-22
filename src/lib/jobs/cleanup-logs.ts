import type PgBoss from 'pg-boss';
import { lt } from 'drizzle-orm';
import { db } from '@/lib/db';
import { pyramidLog } from '@/lib/db/schema/log';
import { logger } from '@/lib/logger';

const JOB_NAME = 'cleanup-logs';
const DAY_MS = 24 * 60 * 60 * 1000;

function retentionDays(): number {
  const n = Number(process.env.LOG_RETENTION_DAYS);
  return Number.isFinite(n) && n > 0 ? n : 7;
}

export async function run() {
  logger.info('cleanup-logs: started');

  const days = retentionDays();
  const cutoff = new Date(Date.now() - days * DAY_MS);

  const deleted = await db
    .delete(pyramidLog)
    .where(lt(pyramidLog.createdAt, cutoff))
    .returning({ id: pyramidLog.id });

  logger.info(`cleanup-logs: deleted ${deleted.length} expired row(s)`, {
    context: { cutoff: cutoff.toISOString(), retentionDays: days },
  });
}

export async function registerCleanupLogs(boss: PgBoss): Promise<void> {
  await boss.createQueue(JOB_NAME);
  await boss.schedule(JOB_NAME, '0 0 * * *', {}, { tz: 'UTC' });
  await boss.work(JOB_NAME, run);
  logger.info('cleanup-logs: scheduled (runs at midnight UTC)');
}
