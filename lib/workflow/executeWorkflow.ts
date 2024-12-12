import db from "@/db";
import { workflowExecution } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import "server-only";

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

	// TODO: setup the execution environment

	// TODO: Initialize workflow execution

	// TODO: initialize phases status

	let executionFailed = false;
	for (const phase of execution.phases) {
		// TODO: Execute phase
	}

	// TODO: Finalize execution

	// TDOD: clean up environment

	revalidatePath("/workflows/runs");
}
