import { buttonStyles } from "@/components/button/button-styles";
import { Iconify } from "@/components/iconify";
import { Link } from "@/components/link";

const sidebarItems: {
	icon: string;
	label: string;
	to: ClientRoutePath;
}[] = [
	{ icon: "lucide:home", label: "Dashboard", to: "/" },
	{ icon: "lucide:users", label: "Users", to: "/profile" },
	{ icon: "lucide:settings", label: "Settings", to: "/profile" },
];

export function Sidebar() {
	return (
		<aside className="w-64 p-4">
			<h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
			<nav>
				<ul>
					{sidebarItems.map((item, index) => (
						<li key={index} className="mb-2">
							<Link
								variant="nav"
								to={item.to}
								className={(active) => buttonStyles({ variant: active ? "primary" : "secondary" })}
							>
								<Iconify icon={item.icon} />
								<span>{item.label}</span>
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
}
