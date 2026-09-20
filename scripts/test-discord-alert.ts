import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { webhookUrl } from '../src/lib/discord/client';
import { DiscordTransport, alertLevel } from '../src/lib/logger/DiscordTransport';

async function main(): Promise<void> {
  if (!webhookUrl()) throw new Error('DISCORD_WEBHOOK_URL is not set');

  const transport = new DiscordTransport({ level: alertLevel() });
  const emit = (level: string, message: string, context: Record<string, unknown>): void =>
    transport.log({ level, message, context }, () => {});

  emit('warning', 'test-discord-alert: sample warning', {
    source: 'test-discord-alert',
    detail: 'this is what a warning looks like',
  });

  emit('error', 'test-discord-alert: sample error', {
    source: 'test-discord-alert',
    requestId: 'test-request-id',
    url: '/work/example',
    method: 'GET',
    stack: new Error('sample failure').stack,
  });

  emit('warning', 'test-discord-alert: sample warning', {
    source: 'test-discord-alert',
    detail: 'duplicate inside the dedupe window, expected to be suppressed',
  });

  await new Promise((resolve) => setTimeout(resolve, 6000));
  console.log('Sent. Expect one amber and one red embed, and no duplicate.');
}

main()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error('Failed:', err instanceof Error ? err.message : err);
    process.exit(1);
  });
