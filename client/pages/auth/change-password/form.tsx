import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { useRouter } from "@//hooks/use-router";
import { Button } from "@/components/button";
import { Field } from "@/components/fields";
import { Form } from "@/components/form";
import { changePasswordPostSchema } from "@/config/zod";
import { useRequestForm } from "@/hooks/use-req-form";
import { sendRequest } from "@/lib/send-request";

export function ChangePasswordForm() {
	const router = useRouter();

	const [searchParams] = useSearchParams();

	const token = searchParams.get("token");
	const email = searchParams.get("email");

	useEffect(() => {
		if (!token || !email) {
			router.push("/auth/forgot-password");
		}
	}, [token, email, router]);

	const { form, handleSubmit, isPending } = useRequestForm(
		{
			schema: changePasswordPostSchema,
			defaultValues: {
				userEmail: email ?? "",
				token: token ?? "",
			},
		},
		{
			path: "/api/auth/change-password",
			method: "POST",
			onSuccess: async () => {
				toast.success("Password changed.");
				await sendRequest("/api/auth/logout", "POST");
				router.push("/auth/login");
			},
			onError: ({ message }) => toast.error(message),
		},
	);

	if (!token || !email) return;

	return (
		<Form form={form} onSubmit={handleSubmit}>
			<Field.Provider id="userEmail" name="userEmail">
				<Field.Label>Email</Field.Label>
				<Field.Input type="email" autoComplete="email" />
				<Field.ErrorMessage />
			</Field.Provider>

			<Field.Provider id="token" name="token">
				<Field.Label>Reset Token</Field.Label>
				<Field.Input type="text" autoComplete="off" />
				<Field.ErrorMessage />
			</Field.Provider>

			<Field.Provider id="password" name="password">
				<Field.Label>Password</Field.Label>
				<Field.Input type="password" autoComplete="current-password" />
				<Field.ErrorMessage />
			</Field.Provider>

			<Field.Provider id="confirmPassword" name="confirmPassword">
				<Field.Label>Confirm Password</Field.Label>
				<Field.Input type="password" autoComplete="off" />
				<Field.ErrorMessage />
			</Field.Provider>

			<Button variant="primary" className="w-full" type="submit" disabled={isPending}>
				{isPending ? "Loading..." : "Register"}
			</Button>

			<small className="text-muted-foreground">Don&apos;t forget it this time...</small>
		</Form>
	);
}
