import { toast } from "sonner";
import { forgotPasswordPostSchema } from "@/generated/zod";
import { useRequestForm } from "@/hooks/use-req-form";

export function ForgotPasswordForm() {
	const { safeSubmit, errors, isPending } = useRequestForm({
		schema: forgotPasswordPostSchema,
		path: "/api/auth/forgot-password",
		options: { method: "POST" },
		onError: ({ message }) => toast.error(message),
	});

	return (
		<form onSubmit={safeSubmit}>
			{errors.root && (
				<div className="callout">
					<p>{errors.root}</p>
				</div>
			)}

			<fieldset>
				<label htmlFor="email">Email</label>
				<input type="email" id="email" name="email" autoComplete="email" autoFocus={true} />
				<label htmlFor="email">{errors.email}</label>
			</fieldset>

			<button type="submit" className="primary w-full" disabled={isPending}>
				{isPending ? "Loading..." : "Send Reset Email"}
			</button>
		</form>
	);
}
