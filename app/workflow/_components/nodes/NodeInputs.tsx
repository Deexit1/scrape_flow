import { Handle, Position, useEdges } from "@xyflow/react";

import useFlowValidation from "@/components/hooks/useFlowValidation";
import { InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";

import { ColorForHandle } from "./common";
import NodeParamField from "./NodeParamField";


export function NodeInputs({ children }: { children: React.ReactNode }) {
	return <div className="flex flex-col divide-y gap-1">{children}</div>;
}

export function NodeInput({
	input,
	nodeId,
}: {
	input: TaskParam;
	nodeId: string;
}) {
	const { invalidInputs } = useFlowValidation();
	const edges = useEdges();
	const isConnected = edges.some(
		(edge) => edge.target === nodeId && edge.targetHandle === input.name
	);

	const hasErrors = invalidInputs
		.find((node) => node.nodeId === nodeId)
		?.inputs.find((invalidInput) => invalidInput === input.name);
	return (
		<div
			className={cn(
				"flex justify-start relative p-3 bg-secondary w-full",
				hasErrors && "bg-destructive/30"
			)}
		>
			<NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />
			{!input.hideHandle && (
				<Handle
					id={input.name}
					type="target"
					isConnectable={!isConnected}
					position={Position.Left}
					className={cn(
						"!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4",
						ColorForHandle[input.type]
					)}
				/>
			)}
		</div>
	);
}
