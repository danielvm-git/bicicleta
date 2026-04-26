ALTER TABLE "builds" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "builds" ADD COLUMN "is_public" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "builds" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "builds" ADD CONSTRAINT "builds_slug_unique" UNIQUE("slug");