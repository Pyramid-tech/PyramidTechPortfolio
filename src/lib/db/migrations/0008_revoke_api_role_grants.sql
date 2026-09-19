DO $$
DECLARE
  api_role text;
BEGIN
  FOREACH api_role IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = api_role) THEN
      EXECUTE format(
        'REVOKE ALL ON "pyramid_team", "pyramid_requests", "pyramid_log", "pyramid_projects", '
        '"pyramid_project_media", "pyramid_project_actions", "pyramid_project_sections", '
        '"pyramid_updates" FROM %I',
        api_role
      );
      EXECUTE format(
        'ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES FROM %I',
        api_role
      );
    END IF;
  END LOOP;
END
$$;
