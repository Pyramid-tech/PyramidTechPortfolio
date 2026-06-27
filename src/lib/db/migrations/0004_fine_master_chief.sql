ALTER TABLE "pyramid_team" ADD COLUMN "approval_status" varchar(20) DEFAULT 'approved' NOT NULL;--> statement-breakpoint
ALTER TABLE "pyramid_team" ADD COLUMN "confidence_score" integer;--> statement-breakpoint
ALTER TABLE "pyramid_team" ADD COLUMN "ai_reason" text;--> statement-breakpoint
ALTER TABLE "pyramid_team" ADD COLUMN "ai_model" varchar(100);--> statement-breakpoint
ALTER TABLE "pyramid_team" ADD COLUMN "approved_by" uuid;--> statement-breakpoint
ALTER TABLE "pyramid_team" ADD COLUMN "approved_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "idx_pyramid_team_approval_status" ON "pyramid_team" USING btree ("approval_status");