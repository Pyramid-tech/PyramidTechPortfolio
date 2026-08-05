// Run all pending captures:  npx tsx scripts/run-capture.ts
// Run a single project:      npx tsx scripts/run-capture.ts <slug>

import { config } from 'dotenv';

config({ path: `${process.cwd()}/.env.local` });
config({ path: `${process.cwd()}/.env` });

if (!process.env.CAPTURE_HTTP_ENDPOINT) process.env.CAPTURE_DRIVER = 'playwright';

async function main(): Promise<void> {
  const { runCapture } = await import('@/lib/jobs/capture-project-media');
  const { getPendingCaptureMedia, getAdminProjects } = await import('@/lib/data/project');

  const only = process.argv[2];
  const projects = await getAdminProjects();
  const selected = only ? projects.filter((p) => p.slug === only || p.id === only) : projects;

  if (selected.length === 0) {
    console.error(only ? `No project matching "${only}"` : 'No projects found');
    process.exit(1);
  }

  for (const project of selected) {
    const media = await getPendingCaptureMedia(project.id);
    const targets = media.filter((m) => m.sourceUrl && m.captureStatus !== 'succeeded');

    if (targets.length === 0) {
      console.log(`${project.slug}: nothing to capture`);
      continue;
    }

    for (const item of targets) {
      console.log(`${project.slug}: capturing ${item.sourceUrl}`);
      await runCapture({
        projectId: project.id,
        mediaId: item.id,
        sourceType: 'website',
        sourceUrl: item.sourceUrl!,
        viewport: { width: 1440, height: 900 },
        requestedAt: new Date().toISOString(),
        idempotencyKey: `manual:${item.id}:${Date.now()}`,
      });
    }
  }
  process.exit(0);
}

main().catch((error) => {
  console.error('capture failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
