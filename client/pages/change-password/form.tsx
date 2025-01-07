import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { useForm } from "@/client/hooks/use-form";
import { useRequest } from "@/client/hooks/use-request";
import { useRouter } from "@/client/hooks/use-router";
import { sendRequest } from "@/client/utils/send-request";
import { changePasswordSchema } from "@/lib/schemas";

export function ChangePasswordForm() {
	const router = useRouter();

	const [searchParams] = useSearchParams();

	const token = searchParams.get("token");
	const email = searchParams.get("email");

	useEffect(() => {
		if (!token || !email) {
			router.push("/forgot-password");
		}
	}, [token, email, router]);

	const { mutate, isPending } = useRequest({
		path: "/api/auth/change-password",
		options: { method: "POST" },
		onError: ({ message }) => toast.error(message),
		onSuccess: async () => {
			toast.success("Password changed.");
			sendRequest("/api/auth/logout", { method: "POST" }).then((res) => {
				router.push("/login");
			});
		},
	});

	const { errors, safeSubmit } = useForm({
		schema: changePasswordSchema,
		next: mutate,
	});

	if (!token || !email) return;

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
					defaultValue={email}
					autoFocus={true}
				/>
				<label htmlFor="email">{errors.email}</label>
			</fieldset>

			<fieldset>
				<label htmlFor="token">Token</label>
				<input
					type="text"
					id="token"
					name="token"
					autoComplete="off"
					defaultValue={token}
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
