import { pgTable, uuid, varchar, text, jsonb, timestamp, index } from 'drizzle-orm/pg-core';

export const pyramidLog = pgTable(
  'pyramid_log',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    level: varchar('level', { length: 20 }).notNull(),
    message: text('message').notNull(),
    context: jsonb('context'),
    stack: text('stack'),
    source: varchar('source', { length: 100 }),
    environment: varchar('environment', { length: 20 }),
    requestId: varchar('request_id', { length: 64 }),
    url: text('url'),
    method: varchar('method', { length: 10 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_pyramid_log_created_at').on(table.createdAt),
    index('idx_pyramid_log_level').on(table.level),
  ],
);

export type PyramidLogRow = typeof pyramidLog.$inferSelect;
