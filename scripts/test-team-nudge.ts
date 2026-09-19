import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

// to run it: npx tsx scripts/test-team-nudge.ts
async function main() {
  const { run } = await import('../src/lib/jobs/team-nudge');
  await run();
}

main()
  .then(() => {
    console.log('Done.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed:', err);
    process.exit(1);
  });
