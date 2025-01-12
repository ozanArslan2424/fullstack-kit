import { createRoute } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { changePasswordPostSchema } from "@/lib/zod";
import { db, table } from "@/server/db";
import { HonoHandler } from "@/server/lib/types";
import { json, messageSchema } from "@/server/lib/utils";
import { hashPassword } from "@/server/routes/auth/auth-utils";

const route = createRoute({
	tags: ["auth"],
	path: "/change-password",
	method: "post",
	request: {
		body: json.requestBody("Change Password Request Body", changePasswordPostSchema),
	},
	responses: {
		200: json.response("Password updated", messageSchema),
		400: json.badRequest(),
		404: json.notFound(),
	},
});

const handler: HonoHandler<typeof route> = async (c) => {
	const data = c.req.valid("json");

	const [passwordResetToken] = await db
		.select()
		.from(table.verification)
		.where(eq(table.verification.userEmail, data.userEmail));

	if (!passwordResetToken) {
		return c.json({ message: "Token not found" }, 404);
	}

	const tokenMatch = passwordResetToken.token === data.token;

	if (!tokenMatch) {
		return c.json({ message: "Invalid token" }, 400);
	}

	const tokenExpired = Date.now() >= passwordResetToken.expiresAt.getTime();

	if (tokenExpired) {
		return c.json({ message: "Token expired" }, 400);
	}

	const passwordHash = await hashPassword(data.password);

	await db.transaction(async (tx) => {
		await tx
			.update(table.account)
			.set({ passwordHash, locked: false })
			.where(eq(table.account.userId, passwordResetToken.userId));
		await tx.delete(table.verification).where(eq(table.verification.token, data.token));
	});

	return c.json({ message: "Password updated" }, 200);
};

export const authChangePasswordPost = { route, handler };
