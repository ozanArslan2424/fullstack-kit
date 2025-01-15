import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useRequest } from "@//hooks/use-request";
import { useRouter } from "@//hooks/use-router";
import { Button } from "@/components/button";
import { ErrorMessage, Form, FormField, Input, Label } from "@/components/form";
import { verifyEmailPostSchema, verifyEmailResendPostSchema } from "@/generated/zod";
import { useRequestForm } from "@/hooks/use-req-form";

type VerifyEmailResendPostValues = z.infer<typeof verifyEmailResendPostSchema>;

export function VerifyEmailForm({ email, token }: { email: string | null; token: string | null }) {
	const [emailState, setEmail] = useState(email);

	const router = useRouter();
	const queryClient = useQueryClient();

	const { handleSubmit, form, isPending } = useRequestForm({
		schema: verifyEmailPostSchema,
		path: "/api/auth/verify-email",
		method: "POST",
		onError: ({ message }) => toast.error(message),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["profile"] });
			toast.success("Email verified.");
			router.push("/profile");
		},
		defaultValues: {
			userEmail: email ?? "",
			token: token ?? "",
		},
	});

	const { mutate: mutateResend, isPending: isPendingResend } =
		useRequest<VerifyEmailResendPostValues>({
			path: "/api/auth/verify-email-resend",
			options: { method: "POST" },
			onError: ({ message }) => toast.error(message),
			onSuccess: () => toast.success("Verification email sent."),
		});

	async function handleResend(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		e.preventDefault();

		if (!emailState) {
			toast.error("Please enter your email.");
			return;
		}

		mutateResend({ email: emailState });
	}

	return (
		<Form {...form} onSubmit={handleSubmit}>
			<FormField id="userEmail" name="userEmail">
				<Label>Email</Label>
				<Input
					type="email"
					autoComplete="email"
					autoFocus={true}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<ErrorMessage />
			</FormField>

			<FormField id="token" name="token">
				<Label>Verification token</Label>
				<Input type="text" />
				<ErrorMessage />
			</FormField>

			<Button
				type="submit"
				variant="primary"
				className="w-full"
				disabled={isPending || isPendingResend}
			>
				{isPending ? "Loading..." : "Verify Email"}
			</Button>

			<Button
				type="button"
				variant="ghost"
				size="sm"
				className="w-full"
				onClick={handleResend}
				disabled={isPending || isPendingResend}
			>
				{isPendingResend
					? "Loading..."
					: "If you haven't received a token or link, enter your email and click here."}
			</Button>
		</Form>
	);
}
