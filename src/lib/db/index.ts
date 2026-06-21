import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

type Db = ReturnType<typeof drizzle>;

let _db: Db | null = null;

function getInstance(): Db {
  if (!_db) {
    const isPooler = process.env.DATABASE_URL?.includes('pooler.supabase.com');
    _db = drizzle(postgres(process.env.DATABASE_URL!, { prepare: !isPooler }));
  }
  return _db;
}

// Proxy defers connection until the first query — safe for scripts that load
// env vars after module imports are resolved (ESM hoisting).
export const db: Db = new Proxy({} as Db, {
  get: (_, prop) => getInstance()[prop as keyof Db],
});
