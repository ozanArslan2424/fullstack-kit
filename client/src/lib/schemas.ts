import { z } from "zod";

const username = z.string().min(3, { message: "Username must be at least 3 characters long" });
const email = z.string().email({ message: "Invalid email" });
const password = z.string().min(6, { message: "Password must be at least 6 characters long" });

export const register = z
	.object({
		username,
		email,
		password,
		confirmPassword: password,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const login = z.object({ email, password });

export const verifyEmail = z.object({
	token: z.string().uuid(),
	email,
	createdAt: z.string(),
});

export const forgotPassword = z.object({ email });

export const changePassword = z
	.object({
		email,
		token: z.string().uuid(),
		password,
		confirmPassword: password,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const profile = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	name: z.string(),
	image: z.string().nullable(),
	about: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
