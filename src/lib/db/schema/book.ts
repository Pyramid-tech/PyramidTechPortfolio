import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const pyramidRequests = pgTable('pyramid_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  service: varchar('service', { length: 100 }).notNull(),
  budget: varchar('budget', { length: 50 }).notNull(),
  pages: varchar('pages', { length: 50 }).notNull(),
  quickness: varchar('quickness', { length: 50 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  websiteUrl: text('website_url'),
  message: text('message'),
  contentHash: varchar('content_hash', { length: 64 }).unique().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type PyramidRequestRow = typeof pyramidRequests.$inferSelect;
