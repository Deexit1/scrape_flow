"use server";

import db from "@/db";
import { workflow } from "@/db/schema";
import { waitFor } from "@/lib/helper/waitFor";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateWorkflow({
	id,
	definition,
}: {
	id: string;
	definition: string;
}) {
	const { userId } = await auth();
	if (!userId) {
		throw new Error("Unauthenticated");
	}

	const workflow_data = await db
		.select()
		.from(workflow)
		.where(and(eq(workflow.id, id), eq(workflow.userId, userId)));

	if (!workflow_data) {
		throw new Error("Workflow not found");
	}

	if (workflow_data[0].status !== "DRAFT") {
		throw new Error("Workflow is not in draft mode");
	}

	await db
		.update(workflow)
		.set({ definition })
		.where(and(eq(workflow.id, id), eq(workflow.userId, userId)));

	revalidatePath(`/workflows`);
}
