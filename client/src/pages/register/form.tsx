import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "@/hooks/use-form";
import { useRouter } from "@/hooks/use-router";
import { app } from "@/lib/config";
import { sendRequest } from "@/utils/send-request";

type RegisterFormValues = z.infer<typeof app.server.register.schema>;

export function RegisterForm() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { errors, isPending, safeSubmit } = useForm<RegisterFormValues, void>({
		schema: app.server.register.schema,
		mutationKey: [app.server.register.path],
		mutationFn: (data: RegisterFormValues) =>
			sendRequest(app.server.register.path, {
				method: app.server.register.method,
				body: JSON.stringify(data),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [app.server.profile.path],
			});
			router.push("/profile");
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
				<label htmlFor="username">Username</label>
				<input
					id="username"
					name="username"
					type="text"
					autoComplete="username"
					autoFocus={true}
				/>
				<label htmlFor="username">{errors.username}</label>
			</fieldset>

			<fieldset>
				<label htmlFor="email">Email</label>
				<input id="email" name="email" type="email" autoComplete="email" />
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
				{isPending ? "Loading..." : "Register"}
			</button>
		</form>
	);
}
