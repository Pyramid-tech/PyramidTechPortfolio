import { Resend } from 'resend';

import { renderProjectRequestEmail } from '@/lib/emails/project-request';
import type { BookRequestDTO } from '@/types/book';

// Lazy so scripts/worker that load `.env.local` after imports still get the key.
let _resend: Resend | null = null;
function resend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!);
  return _resend;
}

export async function sendProjectRequestEmail(to: string[], dto: BookRequestDTO): Promise<void> {
  const { subject, html, text } = renderProjectRequestEmail(dto);
  const { error } = await resend().emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject,
    html,
    text,
  });
  if (error) {
    throw new Error(`Resend rejected the email (${error.name}, ${error.statusCode ?? 'no status'}): ${error.message}`);
  }
}
