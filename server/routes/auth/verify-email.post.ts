import { createRoute } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { db, table } from "@/db";
import { verifyEmailPostSchema } from "@/db/zod";
import { HonoHandler } from "@/server/lib/types";
import { messageSchema, reqBody, resContent } from "@/server/lib/utils";

const route = createRoute({
	tags: ["auth"],
	path: "/verify-email",
	method: "post",
	request: {
		body: reqBody("Verify Email Request Body", verifyEmailPostSchema),
	},
	responses: {
		200: resContent.json("Email verified", messageSchema),
		404: resContent.notFound(),
		400: resContent.badRequest(),
	},
});

const handler: HonoHandler<typeof route> = async (c) => {
	const data = c.req.valid("json");

	const [verification] = await db
		.select()
		.from(table.verification)
		.where(eq(table.verification.userEmail, data.userEmail));

	if (!verification) {
		return c.json({ message: "Verification token not found" }, 404);
	}

	const tokenExpired = Date.now() >= verification.expiresAt.getTime();

	if (tokenExpired) {
		return c.json({ message: "Token expired." }, 400);
	}

	const tokenMatch = verification.token === data.token;

	if (!tokenMatch) {
		return c.json({ message: "Invalid token." }, 400);
	}

	await db.transaction(async (tx) => {
		await tx
			.update(table.user)
			.set({ email: verification.userEmail, emailVerified: true })
			.where(eq(table.user.id, verification.userId));
		await tx.delete(table.verification).where(eq(table.verification.token, verification.token));
	});

	return c.json({ message: "Email verified." }, 200);
};

export const authVerifyEmailPost = { route, handler };
