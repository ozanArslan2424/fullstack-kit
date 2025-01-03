import { useSearchParams } from "react-router";
import { useForm } from "@/hooks/use-form";
import { app } from "@/lib/config";
import { sendRequest } from "@/utils/send-request";

export function ChangePasswordForm() {
	const [searchParams] = useSearchParams();

	const token = searchParams.get("token");
	const email = searchParams.get("email");

	const { errors, isPending, safeSubmit } = useForm({
		schema: app.server.changePassword.schema,
		mutationFn: (data) =>
			sendRequest(app.server.changePassword.path, {
				method: app.server.changePassword.method,
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
				<input
					type="email"
					id="email"
					name="email"
					autoComplete="email"
					defaultValue={email || ""}
					autoFocus={true}
				/>
				<label htmlFor="email">{errors.email}</label>
			</fieldset>

			<fieldset>
				<label htmlFor="token">Email</label>
				<input
					type="text"
					id="token"
					name="token"
					autoComplete="off"
					defaultValue={token || ""}
				/>
				<label htmlFor="token">{errors.token}</label>
			</fieldset>

			<fieldset>
				<label htmlFor="password">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					autoComplete="current-password"
				/>
				<label htmlFor="password">{errors.password}</label>
			</fieldset>

			<fieldset>
				<label htmlFor="confirmPassword">Confirm Password</label>
				<input
					id="confirmPassword"
					name="confirmPassword"
					type="password"
					autoComplete="off"
				/>
				<label htmlFor="confirmPassword">{errors.confirmPassword}</label>
			</fieldset>

			<button type="submit" className="primary w-full" disabled={isPending}>
				{isPending ? "Loading..." : "Change Password"}
			</button>

			<small className="text-muted-foreground">Don&apos;t forget it this time...</small>
		</form>
	);
}
