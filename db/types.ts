import { z } from "zod";
import * as schemas from "./zod";

export type ProfilePostType = z.infer<typeof schemas.profilePostSchema>;
export type ProfileGetType = z.infer<typeof schemas.profileGetSchema>;
export type ProfilePutType = z.infer<typeof schemas.profilePutSchema>;

export type SessionPostType = z.infer<typeof schemas.sessionPostSchema>;
export type SessionGetType = z.infer<typeof schemas.sessionGetSchema>;
export type SessionPutType = z.infer<typeof schemas.sessionPutSchema>;

export type AccountPostType = z.infer<typeof schemas.accountPostSchema>;
export type AccountGetType = z.infer<typeof schemas.accountGetSchema>;
export type AccountPutType = z.infer<typeof schemas.accountPutSchema>;

export type VerificationPostType = z.infer<typeof schemas.verificationPostSchema>;
export type VerificationGetType = z.infer<typeof schemas.verificationGetSchema>;
export type VerificationPutType = z.infer<typeof schemas.verificationPutSchema>;

export type RegisterPostType = z.infer<typeof schemas.registerPostSchema>;
export type LoginPostType = z.infer<typeof schemas.loginPostSchema>;
export type ForgotPasswordPostType = z.infer<typeof schemas.forgotPasswordPostSchema>;
export type ChangePasswordPostType = z.infer<typeof schemas.changePasswordPostSchema>;
export type VerifyEmailPostType = z.infer<typeof schemas.verifyEmailPostSchema>;
export type VerifyEmailResendPostType = z.infer<typeof schemas.verifyEmailResendPostSchema>;
