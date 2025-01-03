import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { app } from "./lib/config";
import { router } from "./lib/router";

export function App({ queryClient }: { queryClient: QueryClient }) {
	return (
		<>
			<title>{app.metadata.title}</title>
			<meta name="description" content={app.metadata.description} />

			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
				<Toaster richColors theme="dark" />
			</QueryClientProvider>
		</>
	);
}
