import { pgTable, uuid, varchar, text, integer, timestamp, index } from 'drizzle-orm/pg-core';

export const pyramidTeam = pgTable(
  'pyramid_team',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    jobTitle: varchar('job_title', { length: 100 }).notNull(),
    description: text('description'),
    email: varchar('email', { length: 255 }).notNull().unique(),
    linkedinUrl: text('linkedin_url'),
    avatarUrl: text('avatar_url'),
    password: varchar('password', { length: 255 }),
    displayOrder: integer('display_order').default(0),
    deactivatedAt: timestamp('deactivated_at', { withTimezone: true }),
    reactivatedAt: timestamp('reactivated_at', { withTimezone: true }),
    // AI confidence gate / approval workflow. Default 'approved' keeps existing
    // members (and any path that doesn't set it) visible; the add/edit flow sets
    // it explicitly from the Groq verdict. Values: 'pending' | 'approved' | 'rejected'.
    approvalStatus: varchar('approval_status', { length: 20 }).notNull().default('approved'),
    confidenceScore: integer('confidence_score'),
    aiReason: text('ai_reason'),
    aiModel: varchar('ai_model', { length: 100 }),
    approvedBy: uuid('approved_by'),
    approvedAt: timestamp('approved_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_pyramid_team_display_order').on(table.displayOrder),
    index('idx_pyramid_team_active_filter').on(table.deactivatedAt, table.reactivatedAt),
    index('idx_pyramid_team_approval_status').on(table.approvalStatus),
  ],
);

export type PyramidTeamRow = typeof pyramidTeam.$inferSelect;
