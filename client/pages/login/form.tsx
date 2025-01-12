import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "@/client/hooks/use-form";
import { useRequest } from "@/client/hooks/use-request";
import { useRouter } from "@/client/hooks/use-router";
import { loginPostSchema } from "@/lib/zod";

export function LoginForm() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { mutate, isPending } = useRequest({
		path: "/api/auth/login",
		options: { method: "POST" },
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["profile"] });
			router.push("/");
		},
		onError: ({ message }) => toast.error(message),
	});

	const { errors, safeSubmit } = useForm({
		schema: loginPostSchema,
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
