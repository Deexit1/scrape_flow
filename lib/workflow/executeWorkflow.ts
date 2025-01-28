import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import db from "@/db";
import {
	ExecutionPhase,
	executionPhase,
	workflow,
	workflowExecution,
} from "@/db/schema";
import { AppNode } from "@/types/appNode";
import {
	ExecutionPhaseStatus,
	WorkflowExecutionStatus,
} from "@/types/workflow";

import "server-only";
import { waitFor } from "../helper/waitFor";
import { TaskRegistry } from "./task/registry";

export async function ExecuteWorkflow(executionId: string) {
	const execution = await db.query.workflowExecution.findFirst({
		where: eq(workflowExecution.id, executionId),
		with: {
			workflow: true,
			phases: true,
		},
	});

	if (!execution) {
		throw new Error("execution not found");
	}

	// setup the execution environment
	const environment = {
		phases: {},
	};

	// Initialize workflow execution
	await initializeWorkflowExecution(executionId, execution.workflowId);

	// initialize phases status
	await initializePhaseStatuses(execution);

	const creditsConsumed = 0;
	let executionFailed = false;
	for (const phase of execution.phases) {
		// TODO: Consume Credits
		// TODO: Execute phase
		const phaseExecution = await executeWorkflowPhase(phase);
		if (!phaseExecution.success) {
			executionFailed = true;
			break;
		}
	}

	// Finalize execution
	await finalizeWorkflowExecution(
		executionId,
		execution.workflowId,
		executionFailed,
		creditsConsumed
	);

	// TDOD: clean up environment

	revalidatePath("/workflows/runs");
}

async function initializeWorkflowExecution(
	executionId: string,
	workflowId: string
) {
	await db
		.update(workflowExecution)
		.set({
			createdAt: new Date(),
			status: WorkflowExecutionStatus.RUNNING,
		})
		.where(eq(workflowExecution.id, executionId));

	await db
		.update(workflow)
		.set({
			lastRunAt: new Date(),
			lastRunStatus: WorkflowExecutionStatus.RUNNING,
			lastRunId: executionId,
		})
		.where(eq(workflow.id, workflowId));
}

async function initializePhaseStatuses(execution: any) {
	await db
		.update(executionPhase)
		.set({
			status: ExecutionPhaseStatus.PENDING,
		})
		.where(
			inArray(
				executionPhase.id,
				execution.phases.map((phase: any) => phase.id)
			)
		);
}

async function finalizeWorkflowExecution(
	executionId: string,
	workflowId: string,
	executionFailed: boolean,
	creditsConsumed: number
) {
	const finalStatus = executionFailed
		? WorkflowExecutionStatus.FAILED
		: WorkflowExecutionStatus.COMPLETED;

	await db
		.update(workflowExecution)
		.set({
			status: finalStatus,
			completedAt: new Date(),
			creditsConsumed: creditsConsumed,
		})
		.where(eq(workflowExecution.id, executionId));

	await db
		.update(workflow)
		.set({
			lastRunStatus: finalStatus,
		})
		.where(
			and(eq(workflow.id, workflowId), eq(workflow.lastRunId, executionId))
		)
		.catch((err) => {
			// igonore
			// This means that we have triggered other runs for this workflow
			// while an execution was running
		});
}

async function executeWorkflowPhase(phase: ExecutionPhase) {
	const startedAt = new Date();
	const node = JSON.parse(phase.node) as AppNode;

	// update the phase status
	await db
		.update(executionPhase)
		.set({
			status: ExecutionPhaseStatus.RUNNING,
			startedAt,
		})
		.where(eq(executionPhase.id, phase.id));

	const creditsRequired = TaskRegistry[node.data.type].credits;
	console.log(
		`Executing phase ${phase.name} with ${creditsRequired} credits required`
	);

	// TODO: decrement user balance (with required credits)

	// Execute phase simulation
	await waitFor(2000);
	const success = Math.random() < 0.7;

	await finalizePhase(phase.id, success);
	return { success };
}

async function finalizePhase(phaseId: string, success: boolean) {
	const finalStatus = success
		? ExecutionPhaseStatus.COMPLETED
		: ExecutionPhaseStatus.FAILED;

	await db
		.update(executionPhase)
		.set({
			status: finalStatus,
			completedAt: new Date(),
		})
		.where(eq(executionPhase.id, phaseId));
}
// 06:35:24
