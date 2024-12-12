CREATE TABLE IF NOT EXISTS "execution_phase" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"status" text NOT NULL,
	"number" integer NOT NULL,
	"node" text NOT NULL,
	"name" text NOT NULL,
	"startedAt" timestamp with time zone DEFAULT now(),
	"completedAt" timestamp with time zone,
	"inputs" text,
	"outputs" text,
	"creditsCost" integer,
	"workflowExecutionId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workflow" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"definition" text NOT NULL,
	"status" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone,
	CONSTRAINT "workflow_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workflow_execution" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workflowId" uuid NOT NULL,
	"userId" text NOT NULL,
	"trigger" text NOT NULL,
	"status" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "execution_phase" ADD CONSTRAINT "execution_phase_workflowExecutionId_workflow_execution_id_fk" FOREIGN KEY ("workflowExecutionId") REFERENCES "public"."workflow_execution"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workflow_execution" ADD CONSTRAINT "workflow_execution_workflowId_workflow_id_fk" FOREIGN KEY ("workflowId") REFERENCES "public"."workflow"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
