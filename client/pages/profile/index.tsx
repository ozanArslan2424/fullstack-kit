import { type ProfileData, useGuard } from "@/client/hooks/use-guard";
import { timestamp } from "@/client/utils/timestamp";

export function ProfilePage() {
	const profile = useGuard("logged-in", "/login");

	if (!profile) return;

	return (
		<div className="mx-auto max-w-max p-8">
			<div className="grid grid-cols-[repeat(4,12rem)] grid-rows-[auto] gap-4">
				<div className="col-start-1 col-end-2 row-start-1 row-end-3">
					<img
						src={profile.image || "https://picsum.photos/id/870/200/300?grayscale"}
						height={200}
						width={200}
						alt="Profile"
						className="aspect-square h-48 w-48 shrink-0 rounded-lg object-cover"
					/>
				</div>
				<div className="col-start-2 col-end-5 row-start-1 row-end-3">
					<AboutCard profile={profile} />
				</div>

				<div className="col-start-1 col-end-5 row-start-3 row-end-5 h-max">
					<div className="bg-muted/60 rounded-lg px-5 py-4 backdrop-blur-2xl">
						<h3>About me</h3>
						<p className="text-muted-foreground">
							{profile.about || "Describe yourself..."}
						</p>
					</div>
				</div>

				<div className="col-start-1 col-end-3 row-start-5 row-end-6 h-max">
					<div className="bg-muted/60 rounded-lg px-5 py-4 backdrop-blur-2xl">
						<h3>My books</h3>
						<p className="text-muted-foreground">Coming soon...</p>
					</div>
				</div>

				<div className="col-start-3 col-end-5 row-start-5 row-end-6 h-max">
					<div className="bg-muted/60 rounded-lg px-5 py-4 backdrop-blur-2xl">
						<h3>Friends</h3>
						<p className="text-muted-foreground">Coming soon...</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export function AboutCard({ profile }: { profile: ProfileData }) {
	return (
		<div className="bg-muted/60 relative flex h-full flex-col justify-between rounded-lg px-5 py-4 backdrop-blur-2xl">
			<div className="space-y-2">
				<h1>{profile.name}</h1>
				<p>{profile.email}</p>
			</div>
			<time dateTime={profile.createdAt} className="text-muted-foreground">
				Joined on {timestamp(profile.createdAt)}
			</time>
		</div>
	);
}
