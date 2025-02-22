import React from "react";

import Logo from "@/components/Logo";

function layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col items-center justify-center h-screen gap-4 w-full">
			<Logo />
			{children}
		</div>
	);
}

export default layout;
