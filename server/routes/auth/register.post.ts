import { createRoute } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { setCookie } from "hono/cookie";
import { db, table } from "@/db";
import { registerPostSchema } from "@/db/zod";
import { ONE_DAY, SESSION_COOKIE_NAME } from "@/server/lib/constants";
import { log } from "@/server/lib/log";
import { HonoHandler } from "@/server/lib/types";
import { messageSchema, reqBody, resContent } from "@/server/lib/utils";
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
		body: reqBody("authRegisterPost Request Body", registerPostSchema),
	},
	responses: {
		200: resContent.json("Registered", messageSchema),
		400: resContent.badRequest(),
		500: resContent.internalServerError(),
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
		expires: new Date(session.expiresAt),
		path: "/",
	});

	return c.json({ message: "User created" }, 200);
};

export const authRegisterPost = { route, handler };
