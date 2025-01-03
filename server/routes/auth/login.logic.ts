import { eq } from "drizzle-orm";
import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import { db, table } from "@/server/db";
import { log } from "@/server/lib/log";
import { SESSION_COOKIE_NAME } from "@/server/routes/auth/constants";
import { createSession, generateSessionToken, verifyPassword } from "@/server/routes/auth/utils";
import { loginSchema } from "./schemas";

export async function loginLogic(c: Context) {
	const user = c.get("user");

	if (user) {
		return c.json({ message: "User already logged in" }, 400);
	}

	const data = await c.req.json();
	const valid = loginSchema.safeParse(data);

	if (!valid.success) {
		return c.json({ message: "Invalid data" }, 400);
	}

	const [existingUser] = await db
		.select()
		.from(table.user)
		.where(eq(table.user.email, valid.data.email));

	if (!existingUser) {
		return c.json({ message: "Email or password is wrong." }, 400);
	}

	const [userAccount] = await db
		.select()
		.from(table.account)
		.where(eq(table.account.userId, existingUser.id));

	if (!userAccount) {
		return c.json({ message: "Email or password is wrong." }, 400);
	}

	if (userAccount.locked) {
		return c.json({ message: "Account is locked" }, 400);
	}

	const passwordMatch = await verifyPassword(userAccount.passwordHash, valid.data.password);

	if (!passwordMatch) {
		return c.json({ message: "Email or password is wrong." }, 400);
	}

	const sessionToken = generateSessionToken();

	const session = await createSession(sessionToken, existingUser.id);

	c.set("user", existingUser);
	c.set("session", session);

	setCookie(c, SESSION_COOKIE_NAME, sessionToken, {
		expires: session.expiresAt,
		path: "/",
	});

	log.info("User logged in", existingUser.email);
	return c.json({ message: "Logged in" }, 200);
}
