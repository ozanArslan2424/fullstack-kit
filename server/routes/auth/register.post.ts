import { createRoute } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { setCookie } from "hono/cookie";
import { ONE_DAY, SESSION_COOKIE_NAME } from "@/lib/constants";
import { log } from "@/lib/log";
import { registerPostSchema } from "@/lib/zod";
import { db, table } from "@/server/db";
import { HonoHandler } from "@/server/lib/types";
import { json, messageSchema } from "@/server/lib/utils";
import {
	createSession,
	generateSessionToken,
	hashPassword,
	sendVerificationEmail,
} from "@/server/routes/auth/auth-utils";

const route = createRoute({
	tags: ["auth"],
	path: "/register",
	method: "post",
	request: {
		body: json.requestBody("authRegisterPost Request Body", registerPostSchema),
	},
	responses: {
		200: json.response("Registered", messageSchema),
		400: json.badRequest(),
		500: json.internalServerError(),
	},
});

const handler: HonoHandler<typeof route> = async (c) => {
	const user = c.get("user");

	if (user) {
		return c.json({ message: "Already logged in" }, 400);
	}

	const data = c.req.valid("json");

	const [existingUser] = await db
		.select()
		.from(table.user)
		.where(eq(table.user.email, data.email));

	if (existingUser) {
		return c.json({ message: "Email already in use" }, 400);
	}

	const userId = crypto.randomUUID();
	const accountId = crypto.randomUUID();
	const verificationToken = crypto.randomUUID();
	const passwordHash = await hashPassword(data.password);

	await db.transaction(async (tx) => {
		await tx.insert(table.user).values({
			id: userId,
			name: data.name,
			email: data.email,
			emailVerified: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		await tx.insert(table.account).values({
			id: accountId,
			providerId: "email",
			userId,
			passwordHash,
		});
		await tx.insert(table.verification).values({
			id: crypto.randomUUID(),
			userEmail: data.email,
			userId,
			token: verificationToken,
			type: "email",
			expiresAt: new Date(Date.now() + ONE_DAY),
			createdAt: new Date(),
		});
	});

	const sendEmailResponse = await sendVerificationEmail(data.email, verificationToken);

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
};

export const authRegisterPost = { route, handler };
