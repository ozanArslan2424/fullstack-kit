import { eq } from "drizzle-orm";
import type { Context } from "hono";
import { db, table } from "@/server/db";
import { changePasswordSchema } from "@/server/routes/auth/schemas";
import { hashPassword } from "@/server/routes/auth/utils";

export async function changePasswordLogic(c: Context) {
	const data = await c.req.json();
	const valid = changePasswordSchema.safeParse(data);

	if (!valid.success) {
		return c.json({ message: "Invalid data" }, 400);
	}

	const [passwordResetToken] = await db
		.select()
		.from(table.verification)
		.where(eq(table.verification.userEmail, data.email));

	if (!passwordResetToken) {
		return c.json({ message: "Invalid email" }, 400);
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
}
