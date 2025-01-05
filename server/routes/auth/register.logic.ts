import { eq } from "drizzle-orm";
import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import { db, table } from "@/server/db";
import { ONE_DAY, SESSION_COOKIE_NAME } from "@/server/routes/auth/constants";
import {
	createSession,
	generateSessionToken,
	hashPassword,
	sendVerificationEmail,
} from "@/server/routes/auth/utils";
import { log } from "@/server/utils";
import { registerSchema } from "./schemas";

export async function registerLogic(c: Context) {
	const user = c.get("user");

	if (user) {
		return c.json({ message: "Already logged in" }, 400);
	}

	const data = await c.req.json();
	const valid = registerSchema.safeParse(data);

	if (!valid.success) {
		return c.json({ message: "Invalid data" }, 400);
	}

	const [existingUser] = await db
		.select()
		.from(table.user)
		.where(eq(table.user.email, valid.data.email));

	if (existingUser) {
		return c.json({ message: "Email already in use" }, 400);
	}

	const userId = crypto.randomUUID();
	const accountId = crypto.randomUUID();
	const verificationToken = crypto.randomUUID();
	const passwordHash = await hashPassword(valid.data.password);

	try {
		await db.transaction(async (tx) => {
			await tx.insert(table.user).values({
				id: userId,
				name: valid.data.username,
				email: valid.data.email,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			await tx.insert(table.account).values({
				id: accountId,
				providerId: "email",
				userId,
				passwordHash,
				emailVerified: false,
			});
			await tx.insert(table.verification).values({
				id: crypto.randomUUID(),
				userEmail: valid.data.email,
				userId,
				token: verificationToken,
				type: "email",
				expiresAt: new Date(Date.now() + ONE_DAY),
				createdAt: new Date(),
			});
		});

		const sendEmailResponse = await sendVerificationEmail(valid.data.email, verificationToken);

		if (sendEmailResponse.error) {
			log.error(sendEmailResponse.error);
			return c.json({ message: "Failed to send verification email" }, 500);
		}

		const sessionToken = generateSessionToken();

		const session = await createSession(sessionToken, userId);

		c.set("user", existingUser);
		c.set("session", session);

		setCookie(c, SESSION_COOKIE_NAME, sessionToken, {
			expires: session.expiresAt,
			path: "/",
		});

		return c.json({ message: "User created" }, 200);
	} catch (error) {
		log.error(error);
		return c.json({ message: "Failed to create user" }, 500);
	}
}
