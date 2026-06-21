import PgBoss from 'pg-boss';

let instance: PgBoss | null = null;

export function getBoss(): PgBoss {
  if (!instance) {
    instance = new PgBoss(process.env.PGBOSS_DATABASE_URL!);
  }
  return instance;
}
