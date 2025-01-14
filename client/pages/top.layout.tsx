import { useQueryClient } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { Link } from "@//components/link";
import { useGuard } from "@//hooks/use-guard";
import { useRouter } from "@//hooks/use-router";
import { ThemeSwitch } from "@/components/theme-switch";
import { useRequest } from "@/hooks/use-request";

export function TopLayout() {
	const profile = useGuard();

	const router = useRouter();
	const queryClient = useQueryClient();

	const { mutate } = useRequest({
		path: "/api/auth/logout",
		options: { method: "POST" },
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["profile"] });
			router.push("/login");
		},
	});

	return (
		<>
			<header className="flex items-center justify-between px-8 py-4">
				<Link to="/">
					<h2>Tabula</h2>
				</Link>
				<nav className="flex items-center gap-2">
					<ThemeSwitch />
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
