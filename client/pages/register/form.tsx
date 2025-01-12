import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "@/client/hooks/use-form";
import { useRequest } from "@/client/hooks/use-request";
import { useRouter } from "@/client/hooks/use-router";
import { registerPostSchema } from "@/db/zod";

export function RegisterForm() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { mutate, isPending } = useRequest({
		path: "/api/auth/register",
		options: { method: "POST" },
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["profile"] });
			router.push("/");
		},
		onError: ({ message }) => toast.error(message),
	});

	const { errors, safeSubmit } = useForm({
		schema: registerPostSchema,
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
				<label htmlFor="name">Username</label>
				<input id="name" name="name" type="text" autoComplete="username" autoFocus={true} />
				<label htmlFor="name">{errors.name}</label>
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
