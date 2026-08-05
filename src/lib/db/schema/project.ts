import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const pyramidProjects = pgTable(
  'pyramid_projects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: varchar('slug', { length: 160 }).notNull().unique(),
    title: varchar('title', { length: 200 }).notNull(),
    summary: text('summary').notNull(),
    overview: text('overview').notNull(),

    origin: varchar('origin', { length: 40 }).notNull(),
    lifecycle: varchar('lifecycle', { length: 40 }).notNull(),
    availability: varchar('availability', { length: 20 }).notNull(),

    client: varchar('client', { length: 200 }),
    industry: varchar('industry', { length: 120 }),
    timeframe: varchar('timeframe', { length: 120 }),

    platforms: text('platforms').array().notNull(),
    services: text('services').array().notNull(),

    featured: boolean('featured').notNull().default(false),
    displayOrder: integer('display_order').notNull().default(0),

    deactivatedAt: timestamp('deactivated_at', { withTimezone: true }),
    reactivatedAt: timestamp('reactivated_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_pyramid_projects_slug').on(table.slug),
    index('idx_pyramid_projects_active_filter').on(table.deactivatedAt, table.reactivatedAt),
    index('idx_pyramid_projects_featured_order').on(table.featured, table.displayOrder),
    index('idx_pyramid_projects_display_order').on(table.displayOrder),
  ],
);

export const pyramidProjectMedia = pgTable(
  'pyramid_project_media',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => pyramidProjects.id, { onDelete: 'cascade' }),
    kind: varchar('kind', { length: 40 }).notNull(),
    url: text('url'),
    posterUrl: text('poster_url'),
    sourceUrl: text('source_url'),
    provider: varchar('provider', { length: 60 }),
    altText: text('alt_text'),
    caption: text('caption'),
    platform: varchar('platform', { length: 40 }),
    isFeatured: boolean('is_featured').notNull().default(false),
    displayOrder: integer('display_order').notNull().default(0),

    captureStatus: varchar('capture_status', { length: 20 }),
    capturedAt: timestamp('captured_at', { withTimezone: true }),
    captureError: text('capture_error'),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_pyramid_project_media_project').on(table.projectId),
    index('idx_pyramid_project_media_order').on(table.projectId, table.displayOrder),
    uniqueIndex('uq_pyramid_project_media_featured')
      .on(table.projectId)
      .where(sql`${table.isFeatured}`),
  ],
);

export const pyramidProjectActions = pgTable(
  'pyramid_project_actions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => pyramidProjects.id, { onDelete: 'cascade' }),
    kind: varchar('kind', { length: 40 }).notNull(),
    label: varchar('label', { length: 80 }).notNull(),
    url: text('url').notNull(),
    isPrimary: boolean('is_primary').notNull().default(false),
    displayOrder: integer('display_order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_pyramid_project_actions_project').on(table.projectId),
    index('idx_pyramid_project_actions_order').on(table.projectId, table.displayOrder),
    uniqueIndex('uq_pyramid_project_actions_primary')
      .on(table.projectId)
      .where(sql`${table.isPrimary}`),
  ],
);

export const pyramidProjectSections = pgTable(
  'pyramid_project_sections',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => pyramidProjects.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 40 }).notNull(),
    heading: varchar('heading', { length: 200 }),
    payload: jsonb('payload').notNull(),
    displayOrder: integer('display_order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_pyramid_project_sections_project').on(table.projectId),
    index('idx_pyramid_project_sections_order').on(table.projectId, table.displayOrder),
  ],
);

export type PyramidProjectRow = typeof pyramidProjects.$inferSelect;
export type PyramidProjectMediaRow = typeof pyramidProjectMedia.$inferSelect;
export type PyramidProjectActionRow = typeof pyramidProjectActions.$inferSelect;
export type PyramidProjectSectionRow = typeof pyramidProjectSections.$inferSelect;
