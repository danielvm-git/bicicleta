CREATE TABLE IF NOT EXISTS "build_components" (
	"id" serial PRIMARY KEY NOT NULL,
	"build_id" integer,
	"component_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "builds" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"total_price" numeric(10, 2) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "build_components" ADD CONSTRAINT "build_components_build_id_builds_id_fk" FOREIGN KEY ("build_id") REFERENCES "public"."builds"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "build_components" ADD CONSTRAINT "build_components_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
