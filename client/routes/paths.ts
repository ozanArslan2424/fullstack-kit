export const paths = {
	root: "/",
	profile: "/profile",
	auth: {
		login: "/auth/login",
		register: "/auth/register",
		forgotPassword: "/auth/forgot-password",
		changePassword: "/auth/change-password",
		verifyEmail: "/auth/verify-email",
	},
} as const;

export type Paths = typeof paths;
