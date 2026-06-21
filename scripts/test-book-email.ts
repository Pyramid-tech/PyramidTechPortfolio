import { config } from 'dotenv';
config({ path: '.env.local' });

import { createBookRequest } from '../src/lib/data/book';

// to run: npx tsx scripts/test-book-email.ts

createBookRequest({
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
