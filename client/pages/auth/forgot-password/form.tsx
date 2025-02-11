import { toast } from "sonner";
import { Button } from "@/components/button";
import { Field } from "@/components/fields";
import { Form } from "@/components/form";
import { forgotPasswordPostSchema } from "@/config/zod";
import { useRequestForm } from "@/hooks/use-req-form";

export function ForgotPasswordForm() {
	const { handleSubmit, form, isPending } = useRequestForm(
		{ schema: forgotPasswordPostSchema },
		{
			path: "/api/auth/forgot-password",
			method: "POST",
			onError: ({ message }) => toast.error(message),
		},
	);

	return (
		<Form form={form} onSubmit={handleSubmit}>
			<Field.Provider id="email" name="email">
				<Field.Label>Email</Field.Label>
				<Field.Input type="email" autoComplete="email" autoFocus={true} />
				<Field.ErrorMessage />
			</Field.Provider>

			<Field.Provider id="password" name="password">
				<Field.Label>Password</Field.Label>
				<Field.Input type="password" autoComplete="current-password" />
				<Field.ErrorMessage />
			</Field.Provider>

			<Button type="submit" variant="primary" className="w-full" disabled={isPending}>
				{isPending ? "Loading..." : "Send Reset Email"}
			</Button>
		</Form>
	);
}
