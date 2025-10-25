CREATE TABLE "rounds" (
	"id" serial PRIMARY KEY,
	"drawnNumbers" integer[],
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"closedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "roundId" integer;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_roundId_rounds_id_fk" FOREIGN KEY ("roundId") REFERENCES "public"."rounds"("id") ON DELETE no action ON UPDATE no action;