import { createRoute } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { db, table } from "@/db";
import { forgotPasswordPostSchema } from "@/db/zod";
import { htmlToString } from "@/server/email/html-to-string";
import { sendEmail } from "@/server/email/send-email";
import { ONE_DAY } from "@/server/lib/constants";
import { env } from "@/server/lib/env";
import { HonoHandler } from "@/server/lib/types";
import { messageSchema, reqBody, resContent } from "@/server/lib/utils";

const route = createRoute({
	tags: ["auth"],
	path: "/forgot-password",
	method: "post",
	request: {
		body: reqBody("Forgot Password Request Body", forgotPasswordPostSchema),
	},
	responses: {
		200: resContent.json("Email sent", messageSchema),
		404: resContent.notFound(),
		500: resContent.internalServerError(),
	},
});

const handler: HonoHandler<typeof route> = async (c) => {
	const data = c.req.valid("json");

	const [existingUser] = await db
		.select()
		.from(table.user)
		.where(eq(table.user.email, data.email));

	if (!existingUser) {
		return c.json({ message: "Email not found." }, 404);
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
	const resetPasswordLink = `${env.BASE_URL}/change-password?email=${data.email}&token=${passwordResetToken}`;

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
};

export const authForgotPasswordPost = { route, handler };
