import { config } from 'dotenv';
config({ path: `${process.cwd()}/.env.local` });

import { getBoss } from '@/lib/jobs/boss';
import { registerCleanupAvatars } from '@/lib/jobs/cleanup-avatars';
import { logger } from '@/lib/logger';

async function start(): Promise<void> {
  const boss = getBoss();

  boss.on('error', (error) =>
    logger.error('pg-boss error', { context: { error: String(error) } }),
  );

  await boss.start();

  await registerCleanupAvatars(boss);

  logger.info('Worker started — waiting for jobs');

  const shutdown = async () => {
    logger.info('Worker shutting down…');
    await boss.stop();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

start().catch((err) => {
  console.error('Worker failed to start:', err);
  process.exit(1);
});
