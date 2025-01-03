import { Hono } from "hono";
import type { HonoType } from "@/server";
import { changePasswordLogic } from "./change-password.logic";
import { forgotPasswordLogic } from "./forgot-password.logic";
import { loginLogic } from "./login.logic";
import { logoutLogic } from "./logout.logic";
import { profileLogic } from "./profile.logic";
import { registerLogic } from "./register.logic";
import { verifyEmailResendLogic } from "./verify-email-resend.logic";
import { verifyEmailLogic } from "./verify-email.logic";

export const authRoutes = new Hono<HonoType>()
	//*------------------------------------------------------------------- Register
	.post("/register", registerLogic)
	//*------------------------------------------------------------------- Login
	.post("/login", loginLogic)
	//*------------------------------------------------------------------- Logout
	.post("/logout", logoutLogic)
	//*------------------------------------------------------------------- Verify Email
	.post("/verify-email", verifyEmailLogic)
	//*------------------------------------------------------------------- Verify Email Resend
	.post("/verify-email-resend", verifyEmailResendLogic)
	//*------------------------------------------------------------------- Forgot Password
	.post("/forgot-password", forgotPasswordLogic)
	//*------------------------------------------------------------------- Reset Password
	.post("/change-password", changePasswordLogic)
	//*------------------------------------------------------------------- Profile
	.get("/profile", profileLogic);
