import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import React from "react";

import db from "@/db";
import { workflow } from "@/db/schema";

import Editor from "../../_components/Editor";

async function page({ params }: { params: { workflowId: string } }) {
	const { workflowId } = params;
	const { userId } = await auth();
	if (!userId) return <div>Unauthenticated</div>;

	const workfflow = await db
		.select()
		.from(workflow)
		.where(and(eq(workflow.id, workflowId), eq(workflow.userId, userId)));
	if (!workfflow) return <div>Workflow not found</div>;

	return <Editor workflow={workfflow[0]} />;
}

export default page;
