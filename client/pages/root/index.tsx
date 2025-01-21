import { buttonStyles } from "@/components/button";
import { Link } from "@/components/link";
import { clientRoutePaths } from "@/config/route-gen";

export function LandingPage() {
	return (
		<div className="space-y-4 p-24">
			<h1>Hello from kit!</h1>
			<div className="flex flex-col gap-2">
				{clientRoutePaths.map((path) => (
					<Link key={path} to={path} className={buttonStyles({ className: "w-max" })}>
						{path}
					</Link>
				))}
			</div>
		</div>
	);
}
