// ?email=${email}&token=${verificationToken}
import { useSearchParams } from "react-router";
import { VerifyEmailForm } from "./form";

export function VerifyEmailPage() {
	const [searchParams] = useSearchParams();
	const email = searchParams.get("email");
	const token = searchParams.get("token");

	console.log(email, token);

	return (
		<div className="mx-auto max-w-sm space-y-6 pt-24">
			<h1>Forgot Password</h1>

			<VerifyEmailForm email={email} token={token} />
		</div>
	);
}
