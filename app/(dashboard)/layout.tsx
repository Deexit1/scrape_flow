import { SignedIn, UserButton } from "@clerk/nextjs";
import React from "react";

import AppSidebar from "@/components/app-sidebar";
import BreadcrumbHeader from "@/components/BreadcrumbHeader";
import { ModeToggle } from "@/components/ThemeModeToggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

function layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen w-full">
			<AppSidebar />
			<div className="flex flex-col flex-1 min-h-screen">
				<header className="flex items-center justify-between px-6 py-4 h-[50px]">
					<BreadcrumbHeader />
					<div className="gap-1 flex items-center">
						<ModeToggle />
						<SignedIn>
							<UserButton />
						</SignedIn>
					</div>
				</header>
				<Separator />
				<div className="overflow-auto container">
					<div className="flex-1 py-4 text-accent-foreground">{children}</div>
				</div>
			</div>
		</div>
	);
}

export default layout;
