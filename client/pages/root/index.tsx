import { Link } from "@//components/link";
import { buttonStyles } from "@/components/button";
import { clientRoutePaths } from "@/generated/routes";

export function LandingPage() {
	return (
		<div className="space-y-4 p-24">
			<h1>Hello from kit!</h1>
			<div className="flex flex-col gap-2">
				{Object.values(clientRoutePaths).map((path) => (
					<Link key={path} to={path} className={buttonStyles({ className: "w-max" })}>
						{path}
					</Link>
				))}
			</div>
		</div>
	);
}
