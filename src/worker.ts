import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { getBoss } from '@/lib/jobs/boss';
import { registerCleanupAvatars } from '@/lib/jobs/cleanup-avatars';
import { registerCleanupLogs } from '@/lib/jobs/cleanup-logs';
import { registerCleanupProjectMedia } from '@/lib/jobs/cleanup-project-media';
import { registerCaptureProjectMedia } from '@/lib/jobs/capture-project-media';
import { registerTeamNudge } from '@/lib/jobs/team-nudge';
import { logger } from '@/lib/logger';

async function start(): Promise<void> {
  const boss = getBoss();

  boss.on('error', (error) =>
    logger.error('pg-boss error', { context: { error: String(error) } }),
  );

  await boss.start();

  await registerCleanupAvatars(boss);
  await registerCleanupLogs(boss);
  await registerCleanupProjectMedia(boss);
  await registerCaptureProjectMedia(boss);
  await registerTeamNudge(boss);

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
