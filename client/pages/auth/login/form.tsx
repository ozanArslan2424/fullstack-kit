import { Button } from "@/components/button";
import { Field } from "@/components/fields";
import { Form } from "@/components/form";
import { loginPostSchema } from "@/config/zod";
import { useRequestForm } from "@/hooks/use-req-form";
import { useRouter } from "@/hooks/use-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
				{isPending ? "Loading..." : "Login"}
			</Button>
		</Form>
	);
}
