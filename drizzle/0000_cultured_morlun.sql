CREATE TABLE "tickets" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idNumber" text NOT NULL,
	"numbers" integer[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
