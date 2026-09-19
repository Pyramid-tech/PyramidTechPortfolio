import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

// to run it: npx tsx scripts/test-book-confirmation-email.ts --dry-run  (or --to <address> to send one email)

import { writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { sendProjectConfirmationEmail } from '../src/lib/email';
import { renderProjectConfirmationEmail } from '../src/lib/emails/project-request-client-confirmation';
import type { BookRequestDTO } from '../src/types/book';

const SAMPLE_REQUEST: BookRequestDTO = {
  service: 'ai-solutions',
  budget: '4-8',
  pages: '6-10',
  quickness: 'regular',
  name: 'Ali Assi',
  phone: '+961 70 000 000',
  email: 'aliassii2025@gmail.com',
  company: 'MyAssi',
  websiteUrl: 'assi.com',
  message: 'This is a test request sent by scripts/test-book-confirmation-email.ts.',
};

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');
  const to = argValue('--to');
  if (!dryRun && !to) throw new Error('Pass --dry-run, or --to <address> to send one email');

  const request = { ...SAMPLE_REQUEST, email: to ?? SAMPLE_REQUEST.email };
  const previewPath = join(tmpdir(), 'pyramid-project-request-client-confirmation.html');
  writeFileSync(previewPath, renderProjectConfirmationEmail(request).html);
  console.log(`Preview: ${previewPath}`);

  if (dryRun || !to) {
    console.log('Dry run: nothing sent.');
    return;
  }

  await sendProjectConfirmationEmail(to, request);
  console.log(`Sent from ${process.env.RESEND_NO_REPLY_FROM_EMAIL} to ${to}.`);
}

main()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error('Failed:', err instanceof Error ? err.message : err);
    process.exit(1);
  });
