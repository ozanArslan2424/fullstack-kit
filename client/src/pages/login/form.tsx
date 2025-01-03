import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "@/hooks/use-form";
import { useRouter } from "@/hooks/use-router";
import { app } from "@/lib/config";
import { sendRequest } from "@/utils/send-request";

type LoginFormValues = z.infer<typeof app.server.login.schema>;

export function LoginForm() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { safeSubmit, errors, isPending } = useForm({
		schema: app.server.login.schema,
		mutationFn: (data: LoginFormValues) =>
			sendRequest(app.server.login.path, {
				method: app.server.login.method,
				body: JSON.stringify(data),
			}),
		onSuccess: () => {
			queryClient
				.invalidateQueries({
					queryKey: [app.server.profile.path],
				})
				.then(() => router.push("/profile"));
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
				<input id="email" name="email" type="email" autoComplete="email" autoFocus={true} />
				<label htmlFor="email">{errors.email}</label>
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

			<button type="submit" className="primary w-full" disabled={isPending}>
				{isPending ? "Loading..." : "Login"}
			</button>
		</form>
	);
}
