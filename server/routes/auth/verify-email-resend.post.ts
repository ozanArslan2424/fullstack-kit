import { eq } from "drizzle-orm";
import { ONE_DAY } from "@/lib/constants";
import { log } from "@/lib/log";
import { verifyEmailResendSchema } from "@/lib/schemas";
import { db, table } from "@/server/db";
import { sendVerificationEmail } from "@/server/routes/auth/auth-utils";
import { HonoContext } from "@/server/types";

export async function verifyEmailResendLogic(c: HonoContext) {
	const data = await c.req.json();
	const valid = verifyEmailResendSchema.safeParse(data);

	if (!valid.success) {
		return c.json({ message: "Invalid data" }, 400);
	}

	const [existingUser] = await db
		.select()
		.from(table.user)
		.where(eq(table.user.email, valid.data.email));

	const [existingAccount] = await db
		.select()
		.from(table.account)
		.where(eq(table.account.userId, existingUser.id));

	if (!existingUser || !existingAccount) {
		return c.json({ message: "Email not found" }, 400);
	}

	const userId = existingUser.id;

	const verificationToken = crypto.randomUUID();

	await db.transaction(async (tx) => {
		await tx.update(table.user).set({ emailVerified: false }).where(eq(table.user.id, userId));
		await tx.delete(table.verification).where(eq(table.verification.userId, userId));
		await tx.insert(table.verification).values({
			id: crypto.randomUUID(),
			userId,
			userEmail: valid.data.email,
			token: verificationToken,
			type: "email",
			createdAt: new Date(),
			expiresAt: new Date(Date.now() + ONE_DAY),
		});
	});

	const sendEmailResponse = await sendVerificationEmail(valid.data.email, verificationToken);

	if (sendEmailResponse.error) {
		log.error(sendEmailResponse.error);
		return c.json({ message: "Failed to send verification email" }, 500);
	}

	return c.json({ message: "Email verification token sent." }, 200);
}
