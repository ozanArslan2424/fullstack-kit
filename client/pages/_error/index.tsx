import { buttonStyles } from "@/components/button/button-styles";
import { GenericError } from "@/components/generic-error";
import { Link } from "@/components/link";
import { isRouteErrorResponse, useRouteError } from "react-router";

export function ErrorPage() {
	const error = useRouteError();

	if (isRouteErrorResponse(error) && error.status === 404) {
		return (
			<div className="mx-auto w-max p-28">
				<div className="space-y-2">
					<h1>This is the 404 page</h1>
					<p className="text-muted-foreground">This means the page you were looking for does not exist.</p>

					<Link to="/" className={buttonStyles({ variant: "primary", className: "mt-4 mb-8 w-full" })}>
						Go back to the home page
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto w-max p-28">
			<div className="space-y-2">
				<h1>This is the error page</h1>
				<p className="text-muted-foreground">I'm sorry you landed here...</p>

				<Link to="/" className={buttonStyles({ variant: "primary", className: "mt-4 mb-8 w-full" })}>
					Go back to the home page
				</Link>

				<h2>Error:</h2>
				<GenericError error={error} />
			</div>
		</div>
	);
}
