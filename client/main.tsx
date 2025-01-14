import { metadata } from "@/generated/metadata";
import { router } from "@/pages/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import "./styles.css";

const rootElement = document.getElementById("root")!;

if (!rootElement) {
	throw new Error("Root element not found");
}

if (rootElement.innerHTML) {
	throw new Error("Root element must be empty");
}

const queryClient = new QueryClient();

ReactDOM.createRoot(rootElement).render(
	<>
		<title>{metadata.title}</title>
		<meta name="description" content={metadata.description} />

		<ThemeProvider attribute="class" enableSystem defaultTheme="system">
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
				<Toaster richColors theme="dark" />
			</QueryClientProvider>
		</ThemeProvider>
	</>,
);
