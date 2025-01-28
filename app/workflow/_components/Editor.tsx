"use client";

import { ReactFlowProvider } from "@xyflow/react";

import { FlowValidationContextProvider } from "@/components/context/FlowValidationContext";
import { Workflow } from "@/db/schema";

import FlowEditor from "./FlowEditor";
import TaskMenu from "./TaskMenu";
import Topbar from "./topbar/Topbar";

export default function Editor({ workflow }: { workflow: Workflow }) {
	return (
		<FlowValidationContextProvider>
			<ReactFlowProvider>
				<div className="flex flex-col h-full w-full overflow-hidden">
					<Topbar
						title="Workflow Editor"
						subtitle={workflow.name}
						workflowId={workflow.id}
					/>
					<section className="flex h-full overflow-auto">
						<TaskMenu />
						<FlowEditor workflow={workflow} />
					</section>
				</div>
			</ReactFlowProvider>
		</FlowValidationContextProvider>
	);
}
// TODO: 5:05:33
