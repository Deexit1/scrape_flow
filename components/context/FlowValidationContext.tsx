import { AppNodeMMissingInputs } from "@/types/appNode";
import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useState,
} from "react";

type FlowValidationContextType = {
	invalidInputs: AppNodeMMissingInputs[];
	setInvalidInputs: Dispatch<SetStateAction<AppNodeMMissingInputs[]>>;
	clearErrors: () => void;
};

export const FlowValidationContext =
	createContext<FlowValidationContextType | null>(null);

export function FlowValidationContextProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [invalidInputs, setInvalidInputs] = useState<AppNodeMMissingInputs[]>(
		[]
	);

	const clearErrors = () => {
		setInvalidInputs([]);
	};
	return (
		<FlowValidationContext.Provider
			value={{ invalidInputs, setInvalidInputs, clearErrors }}
		>
			{children}
		</FlowValidationContext.Provider>
	);
}
