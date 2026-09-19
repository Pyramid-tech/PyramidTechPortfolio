import { loadEnvConfig } from '@next/env';
import type { Config } from 'drizzle-kit';

import { sslFor } from './src/lib/db/ssl';

loadEnvConfig(process.cwd());

function credentials(connectionString: string) {
  const url = new URL(connectionString);
  return {
    host: url.hostname,
    port: Number(url.port || 5432),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1) || 'postgres',
    ssl: sslFor(connectionString),
  };
}

const connectionString = process.env.MIGRATION_DATABASE_URL ?? process.env.DATABASE_URL;

export default {
  schema: './src/lib/db/schema/*.ts',
  out: './src/lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: connectionString ? credentials(connectionString) : { url: '' },
} satisfies Config;
