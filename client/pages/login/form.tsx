import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "@//hooks/use-router";
import { loginPostSchema } from "@/generated/zod";
import { useRequestForm } from "@/hooks/use-req-form";

export function LoginForm() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { safeSubmit, errors, isPending } = useRequestForm({
		schema: loginPostSchema,
		path: "/api/auth/login",
		options: { method: "POST" },
		onError: ({ message }) => toast.error(message),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["profile"] });
			router.push("/");
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
