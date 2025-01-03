import { Link } from "@/components/link";
import { pagePaths } from "@/config";

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
			</div>
		</div>
	);
}
