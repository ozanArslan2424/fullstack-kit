import { eq } from "drizzle-orm";
import type { Context } from "hono";
import { db, table } from "@/server/db";
import { htmlToString } from "@/server/email/html-to-string";
import { sendEmail } from "@/server/email/send-email";
import { env } from "@/server/lib/env";
import { ONE_DAY } from "@/server/routes/auth/constants";
import { forgotPasswordSchema } from "@/server/routes/auth/schemas";

export async function forgotPasswordLogic(c: Context) {
	const data = await c.req.json();
	const valid = forgotPasswordSchema.safeParse(data);

	if (!valid.success) {
		return c.json({ message: "Invalid data" }, 400);
	}

	const [existingUser] = await db
		.select()
		.from(table.user)
		.where(eq(table.user.email, data.email));

	if (!existingUser) {
		return c.json({ message: "Email not found." }, 400);
	}

	const verificationRecordId = crypto.randomUUID();
	const passwordResetToken = crypto.randomUUID();

	await db.insert(table.verification).values({
		id: verificationRecordId,
		userId: existingUser.id,
		userEmail: data.email,
		token: passwordResetToken,
		type: "password",
		expiresAt: new Date(Date.now() + ONE_DAY),
		createdAt: new Date(),
	});

	const emailHtmlString = await htmlToString("forgot-password");
	const resetPasswordLink = `${env.BASE_URL}/reset-password?email=${data.email}&token=${passwordResetToken}`;

	const sendEmailResponse = await sendEmail({
		to: data.email,
		subject: "Tabula Password Reset",
		html: emailHtmlString
			.replace("{{url}}", resetPasswordLink)
			.replaceAll("{{mailto}}", env.EMAIL_USER),
		text: `Please click the link to reset your password. Your account will stay locked until you reset your password. The link is valid for 24 hours. ${resetPasswordLink}`,
	});

	if (sendEmailResponse.error) {
		return c.json({ message: "Failed to send email." }, 500);
	}

	await db
		.update(table.account)
		.set({ locked: true })
		.where(eq(table.account.userId, existingUser.id));

	return c.json({ message: "Email sent." }, 200);
}
