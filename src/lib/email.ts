import { Resend } from 'resend';

import type { BookRequestDTO } from '@/types/book';

// Lazy so scripts/worker that load `.env.local` after imports still get the key.
let _resend: Resend | null = null;
function resend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!);
  return _resend;
}

function buildProjectRequestHtml(dto: BookRequestDTO): string {
  return `
    <h2>New project request from ${dto.name}</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td><strong>Name</strong></td><td>${dto.name}</td></tr>
      <tr><td><strong>Email</strong></td><td>${dto.email}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${dto.phone}</td></tr>
      <tr><td><strong>Company</strong></td><td>${dto.company}</td></tr>
      ${dto.websiteUrl ? `<tr><td><strong>Website</strong></td><td>${dto.websiteUrl}</td></tr>` : ''}
      <tr><td><strong>Service</strong></td><td>${dto.service}</td></tr>
      <tr><td><strong>Budget</strong></td><td>${dto.budget}</td></tr>
      <tr><td><strong>Pages</strong></td><td>${dto.pages}</td></tr>
      <tr><td><strong>Timeline</strong></td><td>${dto.quickness}</td></tr>
      ${dto.message ? `<tr><td><strong>Message</strong></td><td>${dto.message}</td></tr>` : ''}
    </table>
  `;
}

export async function sendProjectRequestEmail(to: string[], dto: BookRequestDTO): Promise<void> {
  await resend().emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `New project request from ${dto.name}`,
    html: buildProjectRequestHtml(dto),
  });
}
