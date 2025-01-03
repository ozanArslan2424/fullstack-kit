import { Link } from "@/components/link";
import { RegisterForm } from "./form";

export function RegisterPage() {
	return (
		<div className="mx-auto max-w-sm space-y-6 pt-24">
			<h1>Register</h1>
			<RegisterForm />

			<div>
				<Link
					to="/login"
					className="text-muted-foreground hover:text-foreground transition-colors"
				>
					Already have an account? Login here.
				</Link>
			</div>
		</div>
	);
}
