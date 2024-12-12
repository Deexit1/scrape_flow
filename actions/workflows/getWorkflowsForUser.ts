"use server";

import db from "@/db";
import { workflow } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GetWorkflowsForUser() {
	const { userId } = await auth();
	if (!userId) {
		throw new Error("Unauthenticated");
	}

	return db
		.select()
		.from(workflow)
		.where(eq(workflow.userId, userId))
		.orderBy(workflow.createdAt);
}
