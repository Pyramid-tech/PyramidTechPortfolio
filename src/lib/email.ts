import { Resend } from 'resend';

import type { BookRequestDTO } from '@/types/book';

// Lazy so scripts/worker that load `.env.local` after imports still get the key.
let _resend: Resend | null = null;
function resend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!);
  return _resend;
}

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

function singleLine(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function row(label: string, value: string | undefined): string {
  if (!value) return '';
  const cell = escapeHtml(value).replace(/\r?\n/g, '<br>');
  return `<tr><td><strong>${label}</strong></td><td>${cell}</td></tr>`;
}

function buildProjectRequestHtml(dto: BookRequestDTO): string {
  return `
    <h2>New project request from ${escapeHtml(singleLine(dto.name))}</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${row('Name', dto.name)}
      ${row('Email', dto.email)}
      ${row('Phone', dto.phone)}
      ${row('Company', dto.company)}
      ${row('Website', dto.websiteUrl)}
      ${row('Service', dto.service)}
      ${row('Budget', dto.budget)}
      ${row('Pages', dto.pages)}
      ${row('Timeline', dto.quickness)}
      ${row('Message', dto.message)}
    </table>
  `;
}

export async function sendProjectRequestEmail(to: string[], dto: BookRequestDTO): Promise<void> {
  const { error } = await resend().emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `New project request from ${singleLine(dto.name)}`,
    html: buildProjectRequestHtml(dto),
  });
  if (error) {
    throw new Error(`Resend rejected the email (${error.name}, ${error.statusCode ?? 'no status'}): ${error.message}`);
  }
}
