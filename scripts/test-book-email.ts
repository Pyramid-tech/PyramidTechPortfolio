import { config } from 'dotenv';
config({ path: '.env.local' });

import { BookRepository } from '../src/modules/book/infrastructure/repositories/BookRepository';
import { TeamRepository } from '../src/modules/team/infrastructure/repositories/TeamRepository';
import { ResendEmailProvider } from '../src/modules/book/infrastructure/providers/ResendEmailProvider';
import { BookService } from '../src/modules/book/application/services/BookService';
import { logger } from '../src/shared/logger';

// to run: npx tsx scripts/test-book-email.ts

const service = new BookService(new BookRepository(), new TeamRepository(), new ResendEmailProvider(), logger);

service
  .submit({
    service: 'ai-solutions',
    budget: '4-8',
    pages: '6-10',
    quickness: 'regular',
    name: 'Test User',
    phone: '0000000000',
    email: 'test@example.com',
    company: 'Test Co',
    websiteUrl: 'https://example.com',
    message: 'This is a test submission from the dev script.',
  })
  .then(() => {
    console.log('Email sent successfully.');
    process.exit(0);
  })
  .catch((err: unknown) => {
    console.error('Failed:', err);
    process.exit(1);
  });
