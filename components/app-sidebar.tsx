"use client";
import { CoinsIcon, Home, Layers2Icon, ShieldCheckIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

import Logo from "./Logo";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "./ui/sidebar";

const items = [
	{
		title: "Home",
		url: "",
		icon: Home,
	},
	{
		title: "Workflows",
		url: "workflows",
		icon: Layers2Icon,
	},
	{
		title: "Credentials",
		url: "credentials",
		icon: ShieldCheckIcon,
	},
	{
		title: "Billing",
		url: "billing",
		icon: CoinsIcon,
	},
];
function AppSidebar() {
	const {
		state,
		open,
		setOpen,
		openMobile,
		setOpenMobile,
		isMobile,
		toggleSidebar,
	} = useSidebar();
	const pathname = usePathname();
	const activeRoute = items.find(
		(route) =>
			(route.url.length > 0 && pathname && pathname.includes(route.url)) ||
			items[0]
	);

	console.log("Movile", pathname, activeRoute);
	return (
		<Sidebar
			side="left"
			variant="sidebar"
			collapsible="offcanvas"
			className="bg-primary/5"
		>
			<SidebarHeader className="flex items-center">
				<Logo />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Todo Credits</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										isActive={activeRoute?.url === item.url}
									>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}

export default AppSidebar;
