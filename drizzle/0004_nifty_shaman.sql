CREATE TABLE "loginIps" (
	"ipAddress" text PRIMARY KEY NOT NULL,
	"failedTries" integer NOT NULL,
	"blockedAt" integer
);
