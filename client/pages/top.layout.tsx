import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { Link } from "@/client/components/link";
import { useGuard } from "@/client/hooks/use-guard";
import { useRouter } from "@/client/hooks/use-router";
import { sendRequest } from "@/client/utils/send-request";

export function TopLayout() {
	const profile = useGuard();

	const router = useRouter();
	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		mutationKey: ["logout"],
		mutationFn: () =>
			sendRequest("/api/auth/logout", {
				method: "POST",
			}),
		onSuccess: () => {
			queryClient
				.invalidateQueries({
					queryKey: ["profile"],
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
					{profile && (
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
