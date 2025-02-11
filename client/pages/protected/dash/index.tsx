import { BulletinBoard } from "./bulletin-board";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export function DashboardPage() {
	return (
		<div className="flex h-screen overflow-hidden">
			<Sidebar />
			<div className="flex flex-1 flex-col overflow-hidden">
				<Header />
				<main className="flex-1 overflow-y-auto p-6">
					<BulletinBoard />
				</main>
			</div>
		</div>
	);
}
