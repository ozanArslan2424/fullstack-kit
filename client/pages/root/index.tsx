import { Link } from "@/client/components/link";
import { pagePaths } from "@/client/pages.gen";

export function LandingPage() {
	return (
		<div className="space-y-4 p-24">
			<h1>Hello from kit!</h1>
			<div className="flex flex-col gap-2">
				{Object.values(pagePaths).map((path) => (
					<Link key={path} to={path} className="button w-max">
						{path}
					</Link>
				))}
				<Link
					to="/change-password"
					className="button w-max"
					search={{
						email: "email@email.email",
						token: "test-token",
					}}
				>
					/change-password (for testing)
				</Link>
			</div>
		</div>
	);
}
