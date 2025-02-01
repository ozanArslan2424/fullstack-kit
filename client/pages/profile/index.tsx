import { Iconify } from "@/components/iconify";
import { Tooltip } from "@/components/modal/tooltip";
import { type ProfileData, useGuard } from "@/hooks/use-guard";
import { timestamp } from "@/lib/timestamp";

export function ProfilePage() {
	const profile = useGuard("logged-in", "/auth/login");

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
			</div>
		</div>
	);
}

export function AboutCard({ profile }: { profile: ProfileData }) {
	return (
		<div className="bg-muted/60 relative flex h-full flex-col justify-between rounded-lg px-5 py-4 backdrop-blur-2xl">
			<div className="space-y-2">
				<h1>{profile.name}</h1>
				<p className="flex items-center gap-2">
					{profile.email}
					<Tooltip tip={profile.emailVerified ? "Email verified" : "Email not verified"}>
						{!profile.emailVerified ? (
							<Iconify icon="lucide:circle-x" className="text-error" />
						) : (
							<Iconify icon="lucide:circle-check" className="text-success" />
						)}
					</Tooltip>
				</p>
			</div>
			<time
				dateTime={timestamp.to.string(profile.createdAt)}
				className="text-muted-foreground"
			>
				Joined on {timestamp.to.readable(profile.createdAt)}
			</time>
		</div>
	);
}
