CREATE TABLE IF NOT EXISTS "brands" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"logo_filename" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "brands_name_unique" UNIQUE("name")
);
--> statement-breakpoint
-- Collect all unique brands from components and groups
INSERT INTO "brands" ("id", "name", "url", "created_at", "updated_at")
SELECT DISTINCT
  LOWER(TRIM(brand)) as "id",
  TRIM(brand) as "name",
  'https://www.' || LOWER(REPLACE(TRIM(brand), ' ', '')) || '.com' as "url",
  NOW(),
  NOW()
FROM (
  SELECT "brand" FROM "components" WHERE "brand" IS NOT NULL AND "brand" != ''
  UNION
  SELECT "brand" FROM "groups" WHERE "brand" IS NOT NULL AND "brand" != ''
) sub
ON CONFLICT ("id") DO NOTHING;



