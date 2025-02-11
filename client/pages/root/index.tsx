import { Button } from "@/components/button";
import { buttonStyles } from "@/components/button/button-styles";
import { Field } from "@/components/fields";
import { Form } from "@/components/form";
import { Link } from "@/components/link";
import { useForm } from "@/hooks/use-form";
import { useRouter } from "@/hooks/use-router";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { z } from "zod";

const loginSchema = z.object({
	email: z.string().email({ message: "Email is required" }).min(1, { message: "Email is required" }),
	password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const registerSchema = loginSchema.extend({
	name: z.string().min(1, { message: "Name is required" }),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export function LandingPage() {
	const [state, setState] = useState<"login" | "register">("login");
	const [searchParams] = useSearchParams();
	const redirect = searchParams.get("redirect");
	const router = useRouter();

	useEffect(() => {
		if (redirect) {
			router.push(redirect as ClientRoutePath);
		}
	}, [redirect, router]);

	return (
		<div className="flex items-start justify-between gap-8 p-24">
			<div className="">
				<h1 className="mb-1.5 text-3xl font-bold">Hello from Cackle!</h1>
				<p className="mb-1.5 opacity-90">Cackle is a platform to share updates about your work.</p>
				<p className="mb-1.5 opacity-90">Keep up with your team in one place.</p>
				<p className="mb-6 opacity-90">You will never forget to read a Jira comment again.</p>

				<Link to="/dash" className={buttonStyles({ variant: "primary" })}>
					Go to dashboard
				</Link>
			</div>

			<div className="border-muted bg-modal text-modal-foreground max-w-md grow rounded-xl border p-6">
				{state === "login" ? <LoginForm /> : <RegisterForm />}

				<button
					type="button"
					className="text-muted-foreground hover:text-foreground mt-6 w-full cursor-pointer"
					onClick={() => setState(state === "login" ? "register" : "login")}
				>
					{state === "login" ? "Register" : "Login"} instead
				</button>
			</div>
		</div>
	);
}

function LoginForm() {
	const form = useForm<LoginValues>({
		schema: loginSchema,
		defaultValues: {
			email: "",
			password: "",
		},
	});

	function handleSubmit(values: LoginValues) {
		console.log(values);
	}

	return (
		<Form form={form} onSubmit={handleSubmit}>
			<Field.Provider id="email" name="email">
				<Field.Label>Email</Field.Label>
				<Field.Input type="email" />
				<Field.ErrorMessage />
			</Field.Provider>

			<Field.Provider id="password" name="password">
				<Field.Label>Password</Field.Label>
				<Field.Input type="password" />
				<Field.ErrorMessage />
			</Field.Provider>

			<Button type="submit" variant="primary" className="w-full">
				Login
			</Button>
		</Form>
	);
}

function RegisterForm() {
	const form = useForm<RegisterValues>({
		schema: registerSchema,
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	function handleSubmit(values: RegisterValues) {
		console.log(values);
	}

	return (
		<Form form={form} onSubmit={handleSubmit}>
			<Field.Provider id="name" name="name">
				<Field.Label>Name</Field.Label>
				<Field.Input type="text" />
				<Field.ErrorMessage />
			</Field.Provider>

			<Field.Provider id="email" name="email">
				<Field.Label>Email</Field.Label>
				<Field.Input type="email" />
				<Field.ErrorMessage />
			</Field.Provider>

			<Field.Provider id="password" name="password">
				<Field.Label>Password</Field.Label>
				<Field.Input type="password" />
				<Field.ErrorMessage />
			</Field.Provider>

			<Button type="submit" variant="primary" className="w-full">
				Register
			</Button>
		</Form>
	);
}
