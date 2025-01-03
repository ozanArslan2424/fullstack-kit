import * as schemas from "@/lib/schemas";

export const app = {
	metadata: {
		title: "Hello from kit!",
		description: "This is my Bun Hono React starter kit!",
	},
	server: {
		register: {
			method: "POST",
			path: "/api/auth/register",
			schema: schemas.register,
		},
		login: {
			method: "POST",
			path: "/api/auth/login",
			schema: schemas.login,
		},
		logout: {
			method: "POST",
			path: "/api/auth/logout",
			schema: null,
		},
		verifyEmail: {
			method: "POST",
			path: "/api/auth/verify-email",
			schema: schemas.verifyEmail,
		},
		forgotPassword: {
			method: "POST",
			path: "/api/auth/forgot-password",
			schema: schemas.forgotPassword,
		},
		changePassword: {
			method: "POST",
			path: "/api/auth/change-password",
			schema: schemas.changePassword,
		},
		profile: {
			method: "GET",
			path: "/api/auth/profile",
			schema: schemas.profile,
		},
	},
} as const;

export const serverRoutePaths = Object.values(app.server).map((route) => route.path);
