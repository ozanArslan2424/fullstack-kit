import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "@//hooks/use-router";
import { Button } from "@/components/button";
import { ErrorMessage, Form, FormField, Input, Label } from "@/components/form";
import { loginPostSchema } from "@/config/zod";
import { useRequestForm } from "@/hooks/use-req-form";

export function LoginForm() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { form, handleSubmit, isPending } = useRequestForm(
		{ schema: loginPostSchema },
		{
			path: "/api/auth/login",
			method: "POST",
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: "profile" });
				router.push("/");
			},
			onError: ({ message }) => toast.error(message),
		},
	);

	return (
		<Form form={form} onSubmit={handleSubmit}>
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
				{isPending ? "Loading..." : "Login"}
			</Button>
		</Form>
	);
}
