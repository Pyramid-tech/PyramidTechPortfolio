import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { getActiveTeamMembers } from '../src/lib/data/team';
import { sendProjectRequestEmail } from '../src/lib/email';
import { renderProjectRequestEmail } from '../src/lib/emails/project-request';
import type { BookRequestDTO } from '../src/types/book';

const SAMPLE_REQUEST: BookRequestDTO = {
  service: 'ai-solutions',
  budget: '4-8',
  pages: '6-10',
  quickness: 'regular',
  name: 'Test User',
  phone: '+961 70 000 000',
  email: 'test@example.com',
  company: 'Test Co',
  websiteUrl: 'example.com',
  message:
    'This is a test request sent by scripts/test-book-email.ts.\nWe want an AI assistant that answers customer questions from our product docs.',
};

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');

  const members = await getActiveTeamMembers();
  const recipients = members.map((member) => member.email).filter(Boolean);
  if (recipients.length === 0) throw new Error('No active team members with an email address');

  console.log(`Active team members (${recipients.length}):`);
  for (const member of members) console.log(`  - ${member.name} <${member.email}>`);

  const previewPath = join(tmpdir(), 'pyramid-project-request-email.html');
  writeFileSync(previewPath, renderProjectRequestEmail(SAMPLE_REQUEST).html);
  console.log(`Preview: ${previewPath}`);

  if (dryRun) {
    console.log('Dry run: nothing sent.');
    return;
  }

  await sendProjectRequestEmail(recipients, SAMPLE_REQUEST);
  console.log(`Sent from ${process.env.RESEND_FROM_EMAIL} to ${recipients.length} team members.`);
}

main()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error('Failed:', err instanceof Error ? err.message : err);
    process.exit(1);
  });
