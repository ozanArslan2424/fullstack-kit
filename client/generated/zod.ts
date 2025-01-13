// Auto-generated file. Do not edit.
import { z } from "zod";

export const profileGetSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	image: z.string().nullable(),
	about: z.string().nullable(),
	emailVerified: z.boolean(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const profilePostSchema = profileGetSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const profilePutSchema = z.optional(profilePostSchema);

export const sessionGetSchema = z.object({
	id: z.string(),
	expiresAt: z.coerce.date(),
	userId: z.string(),
});

export const accountGetSchema = z.object({
	id: z.string(),
	providerId: z.enum(["google", "github", "email"]),
	userId: z.string(),
	passwordHash: z.string(),
	locked: z.boolean().nullable(),
});

export const verificationGetSchema = z.object({
	id: z.string(),
	userEmail: z.string().email(),
	userId: z.string(),
	token: z.string(),
	type: z.enum(["email", "password"]),
	expiresAt: z.coerce.date(),
	createdAt: z.coerce.date(),
});

export const registerPostSchema = profilePostSchema
	.pick({
		name: true,
		email: true,
	})
	.extend({
		password: z.string().min(6),
		confirmPassword: z.string().min(6),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const loginPostSchema = profilePostSchema.pick({ email: true }).extend({
	password: z.string().min(6),
});

export const forgotPasswordPostSchema = profilePostSchema.pick({ email: true });

export const changePasswordPostSchema = verificationGetSchema
	.pick({
		userEmail: true,
		token: true,
	})
	.extend({
		password: z.string().min(6),
		confirmPassword: z.string().min(6),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const verifyEmailPostSchema = verificationGetSchema.pick({
	userEmail: true,
	token: true,
});

export const verifyEmailResendPostSchema = profilePostSchema.pick({ email: true });

export type ProfilePostType = z.infer<typeof profilePostSchema>;
export type ProfileGetType = z.infer<typeof profileGetSchema>;
export type ProfilePutType = z.infer<typeof profilePutSchema>;
export type SessionGetType = z.infer<typeof sessionGetSchema>;
export type AccountGetType = z.infer<typeof accountGetSchema>;
export type VerificationGetType = z.infer<typeof verificationGetSchema>;

export type RegisterPostType = z.infer<typeof registerPostSchema>;
export type LoginPostType = z.infer<typeof loginPostSchema>;
export type ForgotPasswordPostType = z.infer<typeof forgotPasswordPostSchema>;
export type ChangePasswordPostType = z.infer<typeof changePasswordPostSchema>;
export type VerifyEmailPostType = z.infer<typeof verifyEmailPostSchema>;
export type VerifyEmailResendPostType = z.infer<typeof verifyEmailResendPostSchema>;
