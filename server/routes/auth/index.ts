import { createRouter } from "@/server/create-app";
import { changePasswordLogic } from "./change-password.post";
import { forgotPasswordLogic } from "./forgot-password.post";
import { loginLogic } from "./login.post";
import { logoutLogic } from "./logout.post";
import { profileLogic } from "./profile.get";
import { registerLogic } from "./register.post";
import { verifyEmailResendLogic } from "./verify-email-resend.post";
import { verifyEmailLogic } from "./verify-email.post";

export const authRoutes = createRouter()
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
