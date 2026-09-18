import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

type Db = ReturnType<typeof drizzle>;

const globalForDb = globalThis as typeof globalThis & { __pyramidDb?: Db };

function getInstance(): Db {
  if (!globalForDb.__pyramidDb) {
    const isPooler = process.env.DATABASE_URL?.includes('pooler.supabase.com');
    const isServerless = Boolean(process.env.VERCEL);
    globalForDb.__pyramidDb = drizzle(
      postgres(process.env.DATABASE_URL!, {
        prepare: !isPooler,
        max: isServerless ? 1 : 10,
        idle_timeout: isServerless ? 20 : undefined,
        connect_timeout: 10,
        max_lifetime: 60 * 5,
      }),
    );
  }
  return globalForDb.__pyramidDb;
}

// Proxy defers connection until the first query — safe for scripts that load
// env vars after module imports are resolved (ESM hoisting).
export const db: Db = new Proxy({} as Db, {
  get: (_, prop) => getInstance()[prop as keyof Db],
});
