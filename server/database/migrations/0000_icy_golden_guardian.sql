CREATE TABLE IF NOT EXISTS "components" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"model" text NOT NULL,
	"link" text,
	"price" numeric(10, 2) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"brand" text NOT NULL,
	"line" text NOT NULL,
	"configuration" text NOT NULL,
	"front_shifter" text,
	"rear_shifter" text,
	"front_derailleur" text,
	"rear_derailleur" text,
	"cassette" text,
	"bottom_bracket" text,
	"chain" text,
	"crankset" text,
	"axle_type" text
);
