import { Resend } from 'resend';

import type { IEmailProvider } from '../interfaces/IEmailProvider';

export class ResendEmailProvider implements IEmailProvider {
  private client: Resend;
  private from: string;

  constructor() {
    this.client = new Resend(process.env.RESEND_API_KEY!);
    this.from = process.env.RESEND_FROM_EMAIL!;
  }

  async send(to: string[], subject: string, html: string): Promise<void> {
    await this.client.emails.send({ from: this.from, to, subject, html });
  }
}
