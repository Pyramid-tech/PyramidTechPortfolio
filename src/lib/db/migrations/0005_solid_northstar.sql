CREATE TABLE "pyramid_project_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"kind" varchar(40) NOT NULL,
	"label" varchar(80) NOT NULL,
	"url" text NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pyramid_project_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"kind" varchar(40) NOT NULL,
	"url" text,
	"poster_url" text,
	"source_url" text,
	"provider" varchar(60),
	"alt_text" text,
	"caption" text,
	"platform" varchar(40),
	"is_featured" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"capture_status" varchar(20),
	"captured_at" timestamp with time zone,
	"capture_error" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pyramid_project_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"type" varchar(40) NOT NULL,
	"heading" varchar(200),
	"payload" jsonb NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pyramid_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(160) NOT NULL,
	"title" varchar(200) NOT NULL,
	"summary" text NOT NULL,
	"overview" text NOT NULL,
	"origin" varchar(40) NOT NULL,
	"lifecycle" varchar(40) NOT NULL,
	"availability" varchar(20) NOT NULL,
	"client" varchar(200),
	"industry" varchar(120),
	"timeframe" varchar(120),
	"platforms" text[] NOT NULL,
	"services" text[] NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"deactivated_at" timestamp with time zone,
	"reactivated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "pyramid_projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "pyramid_project_actions" ADD CONSTRAINT "pyramid_project_actions_project_id_pyramid_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."pyramid_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pyramid_project_media" ADD CONSTRAINT "pyramid_project_media_project_id_pyramid_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."pyramid_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pyramid_project_sections" ADD CONSTRAINT "pyramid_project_sections_project_id_pyramid_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."pyramid_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_pyramid_project_actions_project" ON "pyramid_project_actions" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idx_pyramid_project_actions_order" ON "pyramid_project_actions" USING btree ("project_id","display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_pyramid_project_actions_primary" ON "pyramid_project_actions" USING btree ("project_id") WHERE "pyramid_project_actions"."is_primary";--> statement-breakpoint
CREATE INDEX "idx_pyramid_project_media_project" ON "pyramid_project_media" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idx_pyramid_project_media_order" ON "pyramid_project_media" USING btree ("project_id","display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_pyramid_project_media_featured" ON "pyramid_project_media" USING btree ("project_id") WHERE "pyramid_project_media"."is_featured";--> statement-breakpoint
CREATE INDEX "idx_pyramid_project_sections_project" ON "pyramid_project_sections" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idx_pyramid_project_sections_order" ON "pyramid_project_sections" USING btree ("project_id","display_order");--> statement-breakpoint
CREATE INDEX "idx_pyramid_projects_slug" ON "pyramid_projects" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_pyramid_projects_active_filter" ON "pyramid_projects" USING btree ("deactivated_at","reactivated_at");--> statement-breakpoint
CREATE INDEX "idx_pyramid_projects_featured_order" ON "pyramid_projects" USING btree ("featured","display_order");--> statement-breakpoint
CREATE INDEX "idx_pyramid_projects_display_order" ON "pyramid_projects" USING btree ("display_order");--> statement-breakpoint

ALTER TABLE "pyramid_projects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "pyramid_project_media" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "pyramid_project_actions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "pyramid_project_sections" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON "pyramid_projects", "pyramid_project_media", "pyramid_project_actions", "pyramid_project_sections" FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON "pyramid_projects", "pyramid_project_media", "pyramid_project_actions", "pyramid_project_sections" FROM authenticated;
  END IF;
END
$$;