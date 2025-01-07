import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "@/client/hooks/use-form";
import { useRequest } from "@/client/hooks/use-request";
import { useRouter } from "@/client/hooks/use-router";
import { sendRequest } from "@/client/utils/send-request";
import { verifyEmailSchema } from "@/lib/schemas";

export function VerifyEmailForm({ email, token }: { email: string | null; token: string | null }) {
	const [emailState, setEmail] = useState(email);

	const router = useRouter();
	const queryClient = useQueryClient();

	const { mutate, isPending } = useRequest({
		path: "/api/auth/verify-email",
		options: { method: "POST" },
		onError: ({ message }) => toast.error(message),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			toast.success("Email verified.");
			router.push("/profile");
		},
	});

	const { errors, safeSubmit } = useForm({
		schema: verifyEmailSchema,
		next: mutate,
	});

	async function handleResend(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		e.preventDefault();
		const { res } = await sendRequest("/api/auth/verify-email-resend", {
			method: "POST",
			body: JSON.stringify({ email: emailState }),
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
