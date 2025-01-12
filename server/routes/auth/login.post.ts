import { createRoute } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { setCookie } from "hono/cookie";
import { SESSION_COOKIE_NAME } from "@/lib/constants";
import { log } from "@/lib/log";
import { loginPostSchema } from "@/lib/zod";
import { db, table } from "@/server/db";
import { HonoHandler } from "@/server/lib/types";
import { json, messageSchema } from "@/server/lib/utils";
import {
	createSession,
	generateSessionToken,
	verifyPassword,
} from "@/server/routes/auth/auth-utils";

const route = createRoute({
	tags: ["auth"],
	path: "/login",
	method: "post",
	request: {
		body: json.requestBody("authLoginPost Request Body", loginPostSchema),
	},
	responses: {
		200: json.response("Logged in", messageSchema),
		400: json.badRequest(),
	},
});

const handler: HonoHandler<typeof route> = async (c) => {
	const user = c.get("user");

	if (user) {
		return c.json({ message: "User already logged in" }, 400);
	}

	const data = c.req.valid("json");

	const [existingUser] = await db
		.select()
		.from(table.user)
		.where(eq(table.user.email, data.email));

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

	const passwordMatch = await verifyPassword(userAccount.passwordHash, data.password);

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
};

export const authLoginPost = { route, handler };
