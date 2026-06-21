CREATE TABLE "pyramid_team" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"job_title" varchar(100) NOT NULL,
	"description" text,
	"email" varchar(255) NOT NULL,
	"linkedin_url" text,
	"avatar_url" text,
	"password" varchar(255),
	"display_order" integer DEFAULT 0,
	"deactivated_at" timestamp with time zone,
	"reactivated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "pyramid_team_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "idx_pyramid_team_display_order" ON "pyramid_team" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "idx_pyramid_team_active_filter" ON "pyramid_team" USING btree ("deactivated_at","reactivated_at");