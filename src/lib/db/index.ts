import { attachDatabasePool } from '@vercel/functions';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

type Db = NodePgDatabase;

const globalForDb = globalThis as typeof globalThis & { __pyramidDb?: Db };

function createPool(): Pool {
  const isServerless = Boolean(process.env.VERCEL);
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: isServerless ? 5 : 10,
    idleTimeoutMillis: isServerless ? 5_000 : 30_000,
    connectionTimeoutMillis: 5_000,
    query_timeout: isServerless ? 8_000 : 30_000,
    keepAlive: true,
    application_name: 'pyramid-web',
  });
  pool.on('error', (error) => console.error('[db] idle client error', error));
  attachDatabasePool(pool);
  return pool;
}

function getInstance(): Db {
  if (!globalForDb.__pyramidDb) {
    globalForDb.__pyramidDb = drizzle({ client: createPool() });
  }
  return globalForDb.__pyramidDb;
}

// Proxy defers connection until the first query — safe for scripts that load
// env vars after module imports are resolved (ESM hoisting).
export const db: Db = new Proxy({} as Db, {
  get: (_, prop) => getInstance()[prop as keyof Db],
});
