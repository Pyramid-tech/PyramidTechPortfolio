CREATE TABLE "pyramid_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service" varchar(100) NOT NULL,
	"budget" varchar(50) NOT NULL,
	"pages" varchar(50) NOT NULL,
	"quickness" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"company" varchar(255) NOT NULL,
	"website_url" text,
	"message" text,
	"content_hash" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "pyramid_requests_content_hash_unique" UNIQUE("content_hash")
);
