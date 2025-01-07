import { z } from "zod";

const authBaseSchema = z.object({
	username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
	email: z.string().email({ message: "Invalid email" }),
	password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
	confirmPassword: z.string().min(6),
});

export const registerSchema = authBaseSchema.refine(
	(data) => data.password === data.confirmPassword,
	{
		message: "Passwords do not match",
		path: ["confirmPassword"],
	},
);

export const loginSchema = authBaseSchema.pick({ email: true, password: true });

export const forgotPasswordSchema = authBaseSchema.pick({ email: true });

export const changePasswordSchema = authBaseSchema
	.omit({ username: true })
	.extend({
		token: z.string().uuid(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const verifyEmailSchema = authBaseSchema.pick({ email: true }).extend({
	token: z.string().uuid(),
});

export const verifyEmailResendSchema = authBaseSchema.pick({ email: true });

export const profileSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	name: z.string(),
	image: z.string().nullable(),
	about: z.string().nullable(),
	emailVerified: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
