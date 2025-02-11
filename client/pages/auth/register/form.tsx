import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/button";
import { Field } from "@/components/fields";
import { Form } from "@/components/form";
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
			<Field.Provider id="name" name="name">
				<Field.Label>Username</Field.Label>
				<Field.Input type="text" autoComplete="username" autoFocus={true} />
				<Field.ErrorMessage />
			</Field.Provider>

			<Field.Provider id="email" name="email">
				<Field.Label>Email</Field.Label>
				<Field.Input type="email" autoComplete="email" />
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
		</Form>
	);
}
