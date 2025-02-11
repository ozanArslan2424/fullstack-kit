import { TopLayout } from "@/layouts/root";
import { ErrorPage } from "@/pages/_error";
import { ChangePasswordPage } from "@/pages/auth/change-password";
import { ForgotPasswordPage } from "@/pages/auth/forgot-password";
import { LoginPage } from "@/pages/auth/login";
import { RegisterPage } from "@/pages/auth/register";
import { VerifyEmailPage } from "@/pages/auth/verify-email";
import { DashboardPage } from "@/pages/protected/dash";
import { ProfilePage } from "@/pages/protected/profile";
import { LandingPage } from "@/pages/root";
import { paths } from "@/routes/paths";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
	{
		Component: TopLayout,
		ErrorBoundary: ErrorPage,
		children: [
			{ path: paths.root, Component: LandingPage },
			{ path: paths.auth.login, Component: LoginPage },
			{ path: paths.auth.register, Component: RegisterPage },
			{ path: paths.auth.forgotPassword, Component: ForgotPasswordPage },
			{ path: paths.auth.changePassword, Component: ChangePasswordPage },
			{ path: paths.auth.verifyEmail, Component: VerifyEmailPage },
			{ path: paths.protected.profile, Component: ProfilePage },
			{ path: paths.protected.dashboard, Component: DashboardPage },
		],
	},
]);
