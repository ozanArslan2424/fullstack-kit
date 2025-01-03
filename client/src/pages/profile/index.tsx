import { useEffect } from "react";
import { type ProfileData, useProfile } from "@/hooks/use-profile";
import { useRouter } from "@/hooks/use-router";
import { GenericError } from "@/pages/_error/generic-error";
import { timestamp } from "@/utils/timestamp";

export function ProfilePage() {
	const { data: profile, isPending, error } = useProfile();

	const router = useRouter();

	useEffect(() => {
		if (error && error.message === "User not logged in") {
			router.push("/login");
		}
	}, [error]);

	if (error) {
		return <GenericError error={error} />;
	}

	if (isPending) {
		return <div>Loading...</div>;
	}

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
