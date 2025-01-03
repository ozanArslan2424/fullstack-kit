import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "@/hooks/use-form";
import { useRouter } from "@/hooks/use-router";
import { app } from "@/lib/config";
import { sendRequest } from "@/utils/send-request";

export function VerifyEmailForm({ email, token }: { email: string | null; token: string | null }) {
	const [emailState, setEmail] = useState(email);

	const router = useRouter();

	const { errors, isPending, safeSubmit } = useForm({
		schema: app.server.verifyEmail.schema,
		mutationFn: (data) =>
			sendRequest(app.server.verifyEmail.path, {
				method: app.server.verifyEmail.method,
				body: JSON.stringify(data),
			}),
		onSuccess: () => {
			toast.success("Email verified.");
			router.push("/profile");
		},
	});

	async function handleResend(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		e.preventDefault();
		const data = { email: emailState };
		const res = await fetch(app.server.verifyEmailResend.path, {
			method: app.server.verifyEmailResend.method,
			body: JSON.stringify(data),
		});

		if (res.ok) {
			toast.success("Verification email sent.");
		} else {
			toast.error("Failed to send verification email.");
		}
	}

	return (
		<form onSubmit={safeSubmit}>
			{errors.root && (
				<div className="callout">
					<p>{errors.root}</p>
				</div>
			)}

			<fieldset>
				<label htmlFor="email">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					autoComplete="email"
					autoFocus={true}
					onChange={(e) => setEmail(e.target.value)}
					value={emailState || ""}
				/>
				<label htmlFor="email">{errors.email}</label>
			</fieldset>

			<fieldset>
				<label htmlFor="token">Verification token</label>
				<input type="text" id="token" name="token" defaultValue={token || ""} />
				<label htmlFor="token">{errors.token}</label>
			</fieldset>

			<button type="submit" className="primary w-full" disabled={isPending}>
				{isPending ? "Loading..." : "Verify Email"}
			</button>

			<button type="button" className="sm ghost w-full" onClick={handleResend}>
				If you haven't received a token or link, enter your email and click here.
			</button>
		</form>
	);
}
