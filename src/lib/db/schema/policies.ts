import { sql } from 'drizzle-orm';
import { pgPolicy } from 'drizzle-orm/pg-core';

export const appWebFullAccess = () =>
  pgPolicy('app_web_full', {
    as: 'permissive',
    for: 'all',
    to: 'app_web',
    using: sql`true`,
    withCheck: sql`true`,
  });
