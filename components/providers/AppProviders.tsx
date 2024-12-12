"use client";

import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "../ui/sidebar";
import dynamic from "next/dynamic";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const NextThemesProvider = dynamic(
	() => import("next-themes").then((e) => e.ThemeProvider),
	{
		ssr: false,
	}
);

export function AppProviders({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());
	return (
		<QueryClientProvider client={queryClient}>
			<NextThemesProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				<SidebarProvider>{children}</SidebarProvider>
			</NextThemesProvider>
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
}
