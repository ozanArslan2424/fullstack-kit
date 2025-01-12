import { toast } from "sonner";
import { useForm } from "@/client/hooks/use-form";
import { useRequest } from "@/client/hooks/use-request";
import { forgotPasswordPostSchema } from "@/db/zod";

export function ForgotPasswordForm() {
	const { mutate, isPending } = useRequest({
		path: "/api/auth/forgot-password",
		options: { method: "POST" },
		onError: ({ message }) => toast.error(message),
	});

	const { errors, safeSubmit } = useForm({
		schema: forgotPasswordPostSchema,
		next: mutate,
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
