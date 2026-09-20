import { Resend, type CreateEmailOptions } from 'resend';

import { renderProjectConfirmationEmail } from '@/lib/emails/project-request-client-confirmation';
import { renderProjectRequestEmail } from '@/lib/emails/project-request-team-notification';
import { SITE } from '@/lib/site';
import type { BookRequestDTO } from '@/types/book';

// Lazy so scripts/worker that load `.env.local` after imports still get the key.
let _resend: Resend | null = null;
function resend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!);
  return _resend;
}

async function send(options: CreateEmailOptions): Promise<void> {
  const { error } = await resend().emails.send(options);
  if (error) {
    throw new Error(
      `Resend rejected the email (${error.name}, ${error.statusCode ?? 'no status'}): ${error.message}`,
    );
  }
}

export async function sendProjectRequestEmail(to: string[], dto: BookRequestDTO): Promise<void> {
  const { subject, html, text } = renderProjectRequestEmail(dto);
  await send({ from: process.env.RESEND_FROM_EMAIL!, to, subject, html, text });
}

export async function sendProjectConfirmationEmail(to: string, dto: BookRequestDTO): Promise<void> {
  const from = process.env.RESEND_NO_REPLY_FROM_EMAIL;
  if (!from) throw new Error('RESEND_NO_REPLY_FROM_EMAIL is not set');
  const { subject, html, text } = renderProjectConfirmationEmail(dto);
  await send({ from, to, replyTo: SITE.email, subject, html, text });
}
