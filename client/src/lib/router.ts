import { createBrowserRouter } from "react-router";
import { ErrorPage, TopLayout } from "@/pages";
import * as pages from "@/pages";

export const router = createBrowserRouter([
	{
		Component: TopLayout,
		ErrorBoundary: ErrorPage,
		children: [
			{ path: "/", Component: pages.LandingPage },
			{ path: "/login", Component: pages.LoginPage },
			{ path: "/register", Component: pages.RegisterPage },
			{ path: "/profile", Component: pages.ProfilePage },
			{ path: "/forgot-password", Component: pages.ForgotPasswordPage },
			{ path: "/change-password", Component: pages.ChangePasswordPage },
			{ path: "/verify-email", Component: pages.VerifyEmailPage },
		],
	},
]);
