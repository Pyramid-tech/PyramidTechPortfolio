-- Lock down the Supabase Data API (PostgREST) for these server-only tables.
--
-- This app talks to Postgres directly via DATABASE_URL (the table-owner role) and
-- to Supabase Storage via the service-role key. Both BYPASS row-level security, so
-- enabling RLS here does NOT affect any query in this codebase. It only denies the
-- public `anon` / `authenticated` API roles — which nothing here uses.
--
-- RLS enabled with NO policies == deny-by-default for those roles. The REVOKE below
-- is belt-and-suspenders. Together these clear the Supabase Security Advisor
-- "RLS Disabled in Public" and "Sensitive Columns Exposed" (pyramid_team.password)
-- warnings.

ALTER TABLE "pyramid_team" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "pyramid_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "pyramid_log" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

-- Revoke API-role grants only when those roles exist (they do on Supabase; this
-- keeps the migration portable to a plain Postgres dev/test DB without them).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON "pyramid_team", "pyramid_requests", "pyramid_log" FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON "pyramid_team", "pyramid_requests", "pyramid_log" FROM authenticated;
  END IF;
END
$$;
