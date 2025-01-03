import { useForm } from "@/hooks/use-form";
import { app } from "@/lib/config";
import { sendRequest } from "@/utils/send-request";

export function ForgotPasswordForm() {
	const { errors, isPending, safeSubmit } = useForm({
		schema: app.server.forgotPassword.schema,
		mutationFn: (data) =>
			sendRequest(app.server.forgotPassword.path, {
				method: app.server.forgotPassword.method,
				body: JSON.stringify(data),
			}),
		onSuccess: () => {
			// TODO
		},
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
