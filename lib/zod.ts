import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import { table } from "../server/db";

export const profilePostSchema = createInsertSchema(table.user);
export const profileGetSchema = createSelectSchema(table.user);
export const profilePutSchema = createUpdateSchema(table.user);

export const sessionPostSchema = createInsertSchema(table.session);
export const sessionGetSchema = createSelectSchema(table.session);
export const sessionPutSchema = createUpdateSchema(table.session);

export const accountPostSchema = createInsertSchema(table.account);
export const accountGetSchema = createSelectSchema(table.account);
export const accountPutSchema = createUpdateSchema(table.account);

export const verificationPostSchema = createInsertSchema(table.verification);
export const verificationGetSchema = createSelectSchema(table.verification);
export const verificationPutSchema = createUpdateSchema(table.verification);

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

export const changePasswordPostSchema = verificationPostSchema
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

export const verifyEmailPostSchema = verificationPostSchema.pick({
	userEmail: true,
	token: true,
});

export const verifyEmailResendPostSchema = profilePostSchema.pick({ email: true });
