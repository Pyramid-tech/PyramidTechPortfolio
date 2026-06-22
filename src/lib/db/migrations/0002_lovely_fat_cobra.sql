CREATE TABLE "pyramid_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"level" varchar(20) NOT NULL,
	"message" text NOT NULL,
	"context" jsonb,
	"stack" text,
	"source" varchar(100),
	"environment" varchar(20),
	"request_id" varchar(64),
	"url" text,
	"method" varchar(10),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_pyramid_log_created_at" ON "pyramid_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_pyramid_log_level" ON "pyramid_log" USING btree ("level");