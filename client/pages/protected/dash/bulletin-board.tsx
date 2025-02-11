import { IssueCard } from "./issue-card";

const mockIssues = [
	{
		id: 1,
		username: "alice",
		content: "We need to improve the onboarding process for new users.",
		responseCount: 5,
	},
	{
		id: 2,
		username: "bob",
		content: "There's a bug in the checkout process that needs to be fixed ASAP.",
		imageUrl: "/placeholder.svg?height=300&width=400",
		responseCount: 3,
	},
	{
		id: 3,
		username: "charlie",
		content: "Can we add a dark mode to the application?",
		responseCount: 8,
	},
];

export function BulletinBoard() {
	return (
		<div>
			{mockIssues.map((issue) => (
				<IssueCard key={issue.id} {...issue} />
			))}
		</div>
	);
}
