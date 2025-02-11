import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { Button } from "@/components/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/card";
import { Iconify } from "@/components/iconify";

interface IssueCardProps {
	username: string;
	content: string;
	imageUrl?: string;
	responseCount: number;
}

export function IssueCard({ username, content, imageUrl, responseCount }: IssueCardProps) {
	return (
		<Card className="mb-4">
			<CardHeader className="flex flex-row items-center gap-4">
				<Avatar>
					<AvatarImage src={`https://avatar.vercel.sh/${username}`} />
					<AvatarFallback>{username[0]}</AvatarFallback>
				</Avatar>
				<div>
					<h3 className="font-semibold">{username}</h3>
				</div>
			</CardHeader>
			<CardContent>
				<p>{content}</p>
				{imageUrl && (
					<img
						src={imageUrl || "/placeholder.svg"}
						alt="Issue attachment"
						className="mt-2 max-h-64 rounded-lg object-cover"
					/>
				)}
			</CardContent>
			<CardFooter className="flex justify-between">
				<div className="flex items-center space-x-2">
					<Button variant="ghost" size="sm">
						<Iconify icon="lucide:message-square" />
						Comment
					</Button>
					<Button variant="ghost" size="sm">
						<Iconify icon="lucide:thumbs-up" />
						+1
					</Button>
				</div>
				<div className="flex items-center space-x-2">
					<span className="text-sm text-gray-500">{responseCount} responses</span>
					<Button variant="ghost" size="icon">
						<Iconify icon="lucide:more-vertical" />
						<span className="sr-only">Menu</span>
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}
