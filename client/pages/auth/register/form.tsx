import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/button";
import { ErrorMessage, Form, FormField, Input, Label } from "@/components/form";
import { registerPostSchema } from "@/config/zod";
import { useRequestForm } from "@/hooks/use-req-form";
import { useRouter } from "@/hooks/use-router";

export function RegisterForm() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { form, handleSubmit, isPending } = useRequestForm(
		{ schema: registerPostSchema },
		{
			path: "/api/auth/register",
			method: "POST",
			onError: ({ message }) => toast.error(message),
			onSuccess: async () => {
				await queryClient.invalidateQueries({ queryKey: "profile" });
				router.push("/profile");
				toast.success("Account created successfully");
			},
		},
	);

	return (
		<Form form={form} onSubmit={handleSubmit}>
			<FormField id="name" name="name">
				<Label>Username</Label>
				<Input type="text" autoComplete="username" autoFocus={true} />
				<ErrorMessage />
			</FormField>

			<FormField id="email" name="email">
				<Label>Email</Label>
				<Input type="email" autoComplete="email" />
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
		</Form>
	);
}
