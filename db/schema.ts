import { InferSelectModel, relations, sql } from "drizzle-orm";
import {
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const workflow = pgTable("workflow", {
	id: uuid("id")
		.default(sql`gen_random_uuid()`)
		.primaryKey(),
	userId: text("userId").notNull(),
	name: text("name").notNull().unique(),
	description: text("description"),
	definition: text("definition").notNull(),
	status: text("status").notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updatedAt", { withTimezone: true }),
});

export const workflowExecution = pgTable("workflow_execution", {
	id: uuid("id")
		.default(sql`gen_random_uuid()`)
		.primaryKey(),
	workflowId: uuid("workflowId")
		.references(() => workflow.id, { onDelete: "cascade" })
		.notNull(),
	userId: text("userId").notNull(),
	trigger: text("trigger").notNull(),
	status: text("status").notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
	completedAt: timestamp("updatedAt", { withTimezone: true }),
});

export const workflowRelations = relations(workflow, ({ many }) => ({
	executions: many(workflowExecution),
}));

export const workflowExecutionRelations = relations(
	workflowExecution,
	({ one, many }) => ({
		workflow: one(workflow, {
			fields: [workflowExecution.workflowId],
			references: [workflow.id],
		}),
		phases: many(executionPhase),
	})
);

export const executionPhase = pgTable("execution_phase", {
	id: uuid("id")
		.default(sql`gen_random_uuid()`)
		.primaryKey(),
	userId: text("userId").notNull(),
	status: text("status").notNull(),
	number: integer("number").notNull(),
	node: text("node").notNull(),
	name: text("name").notNull(),
	startedAt: timestamp("startedAt", { withTimezone: true }).defaultNow(),
	completedAt: timestamp("completedAt", { withTimezone: true }),
	inputs: text("inputs"),
	outputs: text("outputs"),
	creditsConsumed: integer("creditsConsumed"),
	workflowExecutionId: uuid("workflowExecutionId")
		.references(() => workflowExecution.id, { onDelete: "cascade" })
		.notNull(),
});

export const executionPhaseRelations = relations(executionPhase, ({ one }) => ({
	execution: one(workflowExecution, {
		fields: [executionPhase.workflowExecutionId],
		references: [workflowExecution.id],
	}),
}));

export type Workflow = InferSelectModel<typeof workflow>;
export type WorkflowExecution = InferSelectModel<typeof workflowExecution>;
export type ExecutionPhase = InferSelectModel<typeof executionPhase>;
