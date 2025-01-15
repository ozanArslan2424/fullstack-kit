import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { useRouter } from "@//hooks/use-router";
import { Button } from "@/components/button";
import { ErrorMessage, Form, FormField, Input, Label } from "@/components/form";
import { changePasswordPostSchema } from "@/generated/zod";
import { useRequestForm } from "@/hooks/use-req-form";
import { sendRequest } from "@/lib/send-request";

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

	const { form, handleSubmit, isPending } = useRequestForm({
		schema: changePasswordPostSchema,
		path: "/api/auth/change-password",
		method: "POST",
		onError: ({ message }) => toast.error(message),
		onSuccess: async () => {
			toast.success("Password changed.");
			await sendRequest("/api/auth/logout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});
			router.push("/login");
		},
		defaultValues: {
			userEmail: email ?? "",
			token: token ?? "",
		},
	});

	if (!token || !email) return;

	return (
		<Form {...form} onSubmit={handleSubmit}>
			<FormField id="userEmail" name="userEmail">
				<Label>Email</Label>
				<Input type="email" autoComplete="email" />
				<ErrorMessage />
			</FormField>

			<FormField id="token" name="token">
				<Label>Reset Token</Label>
				<Input type="text" />
				<ErrorMessage />
			</FormField>

			<FormField id="password" name="password">
				<Label>Password</Label>
				<Input type="password" autoComplete="current-password" />
				<ErrorMessage />
			</FormField>

			<FormField id="confirmPassword" name="confirmPassword">
				<Label>Confirm Password</Label>
				<Input type="password" autoComplete="off" />
				<ErrorMessage />
			</FormField>

			<Button variant="primary" className="w-full" type="submit" disabled={isPending}>
				{isPending ? "Loading..." : "Register"}
			</Button>

			<small className="text-muted-foreground">Don&apos;t forget it this time...</small>
		</Form>
	);
}
