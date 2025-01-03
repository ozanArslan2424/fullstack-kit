import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { Link } from "@/components/link";
import { useProfile } from "@/hooks/use-profile";
import { useRouter } from "@/hooks/use-router";
import { app } from "@/lib/config";
import { sendRequest } from "@/utils/send-request";

export function TopLayout() {
	const { data } = useProfile();

	const router = useRouter();
	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		mutationKey: [app.server.logout.path],
		mutationFn: () =>
			sendRequest(app.server.logout.path, {
				method: app.server.logout.method,
			}),
		onSuccess: () => {
			queryClient
				.invalidateQueries({
					queryKey: [app.server.profile.path],
				})
				.then(() => router.push("/login"));
		},
	});

	return (
		<>
			<header className="flex items-center justify-between px-8 py-4">
				<Link to="/">
					<h2>Tabula</h2>
				</Link>
				<nav className="flex items-center gap-2">
					<Link to="/" className="button sm">
						Home
					</Link>
					{data && (
						<button
							type="button"
							className="sm hover:text-error"
							onClick={() => mutate()}
						>
							Logout
						</button>
					)}
				</nav>
			</header>
			<Outlet />
		</>
	);
}
