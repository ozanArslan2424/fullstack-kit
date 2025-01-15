import { toast } from "sonner";
import { Button } from "@/components/button";
import { ErrorMessage, Form, FormField, Input, Label } from "@/components/form";
import { forgotPasswordPostSchema } from "@/generated/zod";
import { useRequestForm } from "@/hooks/use-req-form";

export function ForgotPasswordForm() {
	const { handleSubmit, form, isPending } = useRequestForm({
		schema: forgotPasswordPostSchema,
		path: "/api/auth/forgot-password",
		method: "POST",
		onError: ({ message }) => toast.error(message),
	});

	return (
		<Form {...form} onSubmit={handleSubmit}>
			<FormField id="email" name="email">
				<Label>Email</Label>
				<Input type="email" autoComplete="email" autoFocus={true} />
				<ErrorMessage />
			</FormField>

			<FormField id="password" name="password">
				<Label>Password</Label>
				<Input type="password" autoComplete="current-password" />
				<ErrorMessage />
			</FormField>

			<Button type="submit" variant="primary" className="w-full" disabled={isPending}>
				{isPending ? "Loading..." : "Send Reset Email"}
			</Button>
		</Form>
	);
}
