"use server";

import db from "@/db";
import { executionPhase, workflow, workflowExecution } from "@/db/schema";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
	ExecutionPhaseStatus,
	WorkflowExecutionPlan,
	WorkflowExecutionStatus,
	WorkflowExecutionTrigger,
} from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function RunWorkflow(form: {
	workflowId: string;
	flowDefinition?: string;
}) {
	const { userId } = await auth();
	if (!userId) {
		throw new Error("Unauthenticated");
	}

	const { workflowId, flowDefinition } = form;
	if (!workflowId) {
		throw new Error("WorkflowId is required");
	}

	const workflowData = await db
		.select()
		.from(workflow)
		.where(and(eq(workflow.userId, userId), eq(workflow.id, workflowId)));

	if (!workflowData) {
		throw new Error("Workflow not found");
	}

	let executionPlan: WorkflowExecutionPlan;
	if (!flowDefinition) {
		throw new Error("Flow definition is not defined");
	}

	const flow = JSON.parse(flowDefinition);
	const result = FlowToExecutionPlan(flow.nodes, flow.edges);
	if (result.error) {
		throw new Error("Invalid flow definition");
	}

	if (!result.executionPlan) {
		throw new Error("No execution plan generated");
	}

	executionPlan = result.executionPlan;

	const [workflowExecutionEntry] = await db
		.insert(workflowExecution)
		.values({
			workflowId,
			userId,
			status: WorkflowExecutionStatus.PENDING,
			trigger: WorkflowExecutionTrigger.MANUAL,
		})
		.returning({ id: workflowExecution.id });

	const workflowExecutionId = workflowExecutionEntry.id;

	const phases = executionPlan.flatMap((phase) =>
		phase.nodes.map((node) => ({
			userId,
			status: ExecutionPhaseStatus.CREATED,
			number: phase.phase,
			node: JSON.stringify(node),
			name: TaskRegistry[node.data.type].label,
			workflowExecutionId,
		}))
	);

	await db.insert(executionPhase).values(phases);

	const execution = await db.query.workflowExecution.findFirst({
		where: (we) => eq(we.id, workflowExecutionId),
		with: {
			phases: true,
		},
	});

	if (!execution) {
		throw new Error("Workflow Execution not created");
	}

	ExecuteWorkflow(execution.id); // Runs in background
	redirect(`/workflow/runs/${workflowId}/${execution.id}`);
}
