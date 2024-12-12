"use server";

import db from "@/db";
import { workflowExecution } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, asc, eq } from "drizzle-orm";

export async function GetWorkflowExecutionWithPhases(executionId: string) {
	const { userId } = await auth();
	if (!userId) {
		throw new Error("Unauthenticated");
	}

	return await db.query.workflowExecution.findFirst({
		where: and(
			eq(workflowExecution.id, executionId),
			eq(workflowExecution.userId, userId)
		),
		with: {
			phases: {
				orderBy: (phase, { asc }) => [asc(phase.number)],
			},
		},
	});
}
