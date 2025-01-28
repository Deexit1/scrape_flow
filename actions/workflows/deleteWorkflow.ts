"use server";

import db from "@/db";
import { workflow } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function DeleteWorkflow(id: string) {
	const { userId } = await auth();
	if (!userId) {
		throw new Error("Unauthenticated");
	}

	await db.delete(workflow).where(eq(workflow.id, id));

	revalidatePath("/workflows");
}
