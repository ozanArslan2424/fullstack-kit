import { createRouter } from "@/server/lib/create-router";
import { authChangePasswordPost } from "./change-password.post";
import { authForgotPasswordPost } from "./forgot-password.post";
import { authLoginPost } from "./login.post";
import { authLogoutPost } from "./logout.post";
import { authProfileGet } from "./profile.get";
import { authRegisterPost } from "./register.post";
import { authVerifyEmailResendPost } from "./verify-email-resend.post";
import { authVerifyEmailPost } from "./verify-email.post";

export const authRoutes = createRouter()
	.openapi(authLoginPost.route, authLoginPost.handler)
	.openapi(authLogoutPost.route, authLogoutPost.handler)
	.openapi(authRegisterPost.route, authRegisterPost.handler)
	.openapi(authVerifyEmailPost.route, authVerifyEmailPost.handler)
	.openapi(authVerifyEmailResendPost.route, authVerifyEmailResendPost.handler)
	.openapi(authChangePasswordPost.route, authChangePasswordPost.handler)
	.openapi(authForgotPasswordPost.route, authForgotPasswordPost.handler)
	.openapi(authProfileGet.route, authProfileGet.handler);
