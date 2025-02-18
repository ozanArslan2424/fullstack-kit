import { Link } from "@/components/link";
import { useGuard } from "@/hooks/use-guard";
import { LoginForm } from "./form";

export function LoginPage() {
	useGuard("logged-out", "/profile");

	return (
		<div className="mx-auto max-w-sm space-y-6 pt-24">
			<h1>Login</h1>
			<LoginForm />

			<div className="flex flex-col gap-2">
				<Link to="/auth/forgot-password" className="text-muted-foreground hover:text-foreground transition-colors">
					Forgot password?
				</Link>
				<Link to="/auth/register" className="text-muted-foreground hover:text-foreground transition-colors">
					Don&apos;t have an account? Register here.
				</Link>
			</div>
		</div>
	);
}
