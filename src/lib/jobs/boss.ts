import PgBoss from 'pg-boss';

import { logger } from '@/lib/logger';

let instance: PgBoss | null = null;

export function getBoss(): PgBoss {
  if (!instance) {
    instance = new PgBoss(process.env.PGBOSS_DATABASE_URL!);
  }
  return instance;
}

let sender: PgBoss | null = null;
let starting: Promise<PgBoss | null> | null = null;

async function getSender(): Promise<PgBoss | null> {
  if (sender) return sender;
  if (starting) return starting;

  const connectionString = process.env.PGBOSS_DATABASE_URL;
  if (!connectionString) return null;

  starting = (async () => {
    try {
      const boss = new PgBoss({
        connectionString,
        supervise: false,
        schedule: false,
        migrate: false,
      });
      boss.on('error', (error) =>
        logger.error('pg-boss sender error', { context: { error: String(error) } }),
      );
      await boss.start();
      sender = boss;
      return boss;
    } catch (error) {
      logger.error('pg-boss sender failed to start', { context: { error: String(error) } });
      return null;
    } finally {
      starting = null;
    }
  })();

  return starting;
}

export async function enqueue(queue: string, data: object): Promise<boolean> {
  const boss = await getSender();
  if (!boss) return false;

  try {
    await boss.createQueue(queue);
    await boss.send(queue, data);
    return true;
  } catch (error) {
    logger.error('pg-boss enqueue failed', { context: { queue, error: String(error) } });
    return false;
  }
}
