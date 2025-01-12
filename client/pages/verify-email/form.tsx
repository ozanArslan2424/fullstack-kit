import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "@/client/hooks/use-form";
import { useRequest } from "@/client/hooks/use-request";
import { useRouter } from "@/client/hooks/use-router";
import { verifyEmailPostSchema, verifyEmailResendPostSchema } from "@/db/zod";

type VerifyEmailPostValues = z.infer<typeof verifyEmailPostSchema>;
type VerifyEmailResendPostValues = z.infer<typeof verifyEmailResendPostSchema>;

export function VerifyEmailForm({ email, token }: { email: string | null; token: string | null }) {
	const [emailState, setEmail] = useState(email);

	const router = useRouter();
	const queryClient = useQueryClient();

	const { mutate, isPending } = useRequest<VerifyEmailPostValues>({
		path: "/api/auth/verify-email",
		options: { method: "POST" },
		onError: ({ message }) => toast.error(message),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["profile"] });
			toast.success("Email verified.");
			router.push("/profile");
		},
	});

	const { errors, safeSubmit } = useForm({
		schema: verifyEmailPostSchema,
		next: mutate,
	});

	const { mutate: mutateResend, isPending: isPendingResend } =
		useRequest<VerifyEmailResendPostValues>({
			path: "/api/auth/verify-email-resend",
			options: { method: "POST" },
			onError: ({ message }) => toast.error(message),
			onSuccess: () => toast.success("Verification email sent."),
		});

	async function handleResend(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		e.preventDefault();

		if (!emailState) {
			toast.error("Please enter your email.");
			return;
		}

		mutateResend({ email: emailState });
	}

	return (
		<form onSubmit={safeSubmit}>
			{errors.root && (
				<div className="callout">
					<p>{errors.root}</p>
				</div>
			)}

			<fieldset>
				<label htmlFor="userEmail">Email</label>
				<input
					type="email"
					id="userEmail"
					name="userEmail"
					autoComplete="email"
					autoFocus={true}
					onChange={(e) => setEmail(e.target.value)}
					value={emailState || ""}
				/>
				<label htmlFor="userEmail">{errors.userEmail}</label>
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
				{isPendingResend
					? "Loading..."
					: "If you haven't received a token or link, enter your email and click here."}
			</button>
		</form>
	);
}
