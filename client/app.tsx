import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { router } from "@/client/pages/router";
import { metadata } from "@/lib/constants";

export function App({ queryClient }: { queryClient: QueryClient }) {
	return (
		<>
			<title>{metadata.title}</title>
			<meta name="description" content={metadata.description} />

			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
				<Toaster richColors theme="dark" />
			</QueryClientProvider>
		</>
	);
}
