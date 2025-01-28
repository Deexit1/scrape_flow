ALTER TABLE "workflow" ADD COLUMN "lastRunAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "workflow" ADD COLUMN "lastRunId" text;--> statement-breakpoint
ALTER TABLE "workflow" ADD COLUMN "lastRunStatus" text;