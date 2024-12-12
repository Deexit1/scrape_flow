"use server";

import db from "@/db";
import { executionPhase } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export async function GetWorkflowPhaseDetails(phaseId: string) {
	const { userId } = await auth();
	if (!userId) {
		throw new Error("Unauthenticated");
	}

	return db.query.executionPhase.findFirst({
		where: and(
			eq(executionPhase.id, phaseId),
			eq(executionPhase.userId, userId)
		),
	});
}
