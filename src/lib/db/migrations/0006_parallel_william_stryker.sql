CREATE TABLE "pyramid_updates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" varchar(20) NOT NULL,
	"content" text NOT NULL,
	"message_id" integer,
	"chat_id" varchar(64),
	"snapshot" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pyramid_team" ADD COLUMN "latest_login_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "idx_pyramid_updates_kind_created" ON "pyramid_updates" USING btree ("kind","created_at");