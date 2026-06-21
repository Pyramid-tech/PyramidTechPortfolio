import crypto from 'crypto';

import type { ITeamRepository } from '@/modules/team/infrastructure/interfaces/ITeamRepository';
import type { IBookRepository } from '../../infrastructure/interfaces/IBookRepository';
import type { IEmailProvider } from '../../infrastructure/interfaces/IEmailProvider';
import type { ILogger } from '@/shared/logger/interfaces/ILogger';
import type { BookRequestDTO } from '../dtos/BookRequestDTO';
import { HttpError } from '@/shared/errors/HttpError';

function buildHash(dto: BookRequestDTO): string {
  const content = [dto.service, dto.name, dto.email, dto.company, dto.message ?? ''].join('|');
  return crypto.createHash('sha256').update(content).digest('hex');
}

function buildEmailHtml(dto: BookRequestDTO): string {
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

export class BookService {
  constructor(
    private readonly bookRepository: IBookRepository,
    private readonly teamRepository: ITeamRepository,
    private readonly emailProvider: IEmailProvider,
    private readonly logger: ILogger,
  ) {}

  async submit(dto: BookRequestDTO): Promise<void> {
    const hash = buildHash(dto);

    if (await this.bookRepository.isDuplicate(hash)) {
      this.logger.warning('book-request: duplicate blocked', { hash });
      throw new HttpError(409, 'Your request was already received — we will be in touch soon.');
    }

    const members = await this.teamRepository.getActiveMembers();
    const emails = members.map((m) => m.email).filter(Boolean);

    if (emails.length === 0) {
      this.logger.warning('book-request: no active members to notify');
    } else {
      await this.emailProvider.send(
        emails,
        `New project request from ${dto.name}`,
        buildEmailHtml(dto),
      );
      this.logger.info('book-request: sent', { to: emails, from: dto.email });
    }

    await this.bookRepository.create(dto, hash);
  }

  async getAll(): Promise<ReturnType<IBookRepository['getAll']>> {
    return this.bookRepository.getAll();
  }
}
