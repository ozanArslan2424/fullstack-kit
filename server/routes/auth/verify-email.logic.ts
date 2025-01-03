import { eq } from "drizzle-orm";
import type { Context } from "hono";
import { db, table } from "@/server/db";
import { verifyEmailSchema } from "./schemas";

export async function verifyEmailLogic(c: Context) {
	const data = await c.req.json();
	const valid = verifyEmailSchema.safeParse(data);

	if (!valid.success) {
		return c.json({ message: "Invalid data" }, 400);
	}

	const [verification] = await db
		.select()
		.from(table.verification)
		.where(eq(table.verification.userEmail, valid.data.email));

	if (!verification) {
		return c.json({ message: "Invalid email." }, 400);
	}

	const tokenExpired = Date.now() >= verification.expiresAt.getTime();

	if (tokenExpired) {
		return c.json({ message: "Token expired." }, 400);
	}

	const tokenMatch = verification.token === valid.data.token;

	if (!tokenMatch) {
		return c.json({ message: "Invalid token." }, 400);
	}

	await db.transaction(async (tx) => {
		await tx
			.update(table.user)
			.set({ email: verification.userEmail })
			.where(eq(table.user.id, verification.userId));
		await tx
			.update(table.account)
			.set({ emailVerified: true })
			.where(eq(table.account.userId, verification.userId));
		await tx.delete(table.verification).where(eq(table.verification.token, verification.token));
	});

	return c.json({ message: "Email verified." }, 200);
}
