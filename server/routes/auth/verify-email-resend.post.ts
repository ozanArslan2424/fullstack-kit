import { createRoute } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { db, table } from "@/db";
import { verifyEmailResendPostSchema } from "@/db/zod";
import { ONE_DAY } from "@/lib/constants";
import { log } from "@/lib/log";
import { HonoHandler } from "@/server/lib/types";
import { json, messageSchema } from "@/server/lib/utils";
import { sendVerificationEmail } from "@/server/routes/auth/auth-utils";

const route = createRoute({
	tags: ["auth"],
	path: "/verify-email-resend",
	method: "post",
	request: {
		body: json.requestBody(
			"authVerifyEmailResendPost Request Body",
			verifyEmailResendPostSchema,
		),
	},
	responses: {
		200: json.response("Verification email resent", messageSchema),
		404: json.notFound(),
		500: json.internalServerError(),
	},
});

const handler: HonoHandler<typeof route> = async (c) => {
	const data = c.req.valid("json");

	const [existingUser] = await db
		.select()
		.from(table.user)
		.where(eq(table.user.email, data.email));

	const [existingAccount] = await db
		.select()
		.from(table.account)
		.where(eq(table.account.userId, existingUser.id));

	if (!existingUser || !existingAccount) {
		return c.json({ message: "Email not found" }, 404);
	}

	const userId = existingUser.id;

	const verificationToken = crypto.randomUUID();

	await db.transaction(async (tx) => {
		await tx.update(table.user).set({ emailVerified: false }).where(eq(table.user.id, userId));
		await tx.delete(table.verification).where(eq(table.verification.userId, userId));
		await tx.insert(table.verification).values({
			id: crypto.randomUUID(),
			userId,
			userEmail: data.email,
			token: verificationToken,
			type: "email",
			createdAt: new Date(),
			expiresAt: new Date(Date.now() + ONE_DAY),
		});
	});

	const sendEmailResponse = await sendVerificationEmail(data.email, verificationToken);

	if (sendEmailResponse.error) {
		log.error(sendEmailResponse.error);
		return c.json({ message: "Failed to send verification email" }, 500);
	}

	return c.json({ message: "Email verification token sent." }, 200);
};

export const authVerifyEmailResendPost = { route, handler };
