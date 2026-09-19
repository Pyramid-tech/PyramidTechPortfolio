ALTER TABLE "pyramid_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "pyramid_log" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "pyramid_project_actions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "pyramid_project_media" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "pyramid_project_sections" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "pyramid_projects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "pyramid_team" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "pyramid_updates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "app_web_full" ON "pyramid_requests" AS PERMISSIVE FOR ALL TO "app_web" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "app_web_full" ON "pyramid_log" AS PERMISSIVE FOR ALL TO "app_web" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "app_web_full" ON "pyramid_project_actions" AS PERMISSIVE FOR ALL TO "app_web" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "app_web_full" ON "pyramid_project_media" AS PERMISSIVE FOR ALL TO "app_web" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "app_web_full" ON "pyramid_project_sections" AS PERMISSIVE FOR ALL TO "app_web" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "app_web_full" ON "pyramid_projects" AS PERMISSIVE FOR ALL TO "app_web" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "app_web_full" ON "pyramid_team" AS PERMISSIVE FOR ALL TO "app_web" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "app_web_full" ON "pyramid_updates" AS PERMISSIVE FOR ALL TO "app_web" USING (true) WITH CHECK (true);