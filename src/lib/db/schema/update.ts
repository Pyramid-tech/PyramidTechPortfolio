import { pgTable, uuid, varchar, text, integer, jsonb, timestamp, index } from 'drizzle-orm/pg-core';

import { appWebFullAccess } from './policies';

export const pyramidUpdates = pgTable(
  'pyramid_updates',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    kind: varchar('kind', { length: 20 }).notNull(),
    content: text('content').notNull(),
    messageId: integer('message_id'),
    chatId: varchar('chat_id', { length: 64 }),
    snapshot: jsonb('snapshot'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_pyramid_updates_kind_created').on(table.kind, table.createdAt),
    appWebFullAccess(),
  ],
);

export type PyramidUpdateRow = typeof pyramidUpdates.$inferSelect;
