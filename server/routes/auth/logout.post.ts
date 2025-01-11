import { createRoute } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { deleteCookie } from "hono/cookie";
import { db, table } from "@/db";
import { SESSION_COOKIE_NAME } from "@/lib/constants";
import { HonoHandler } from "@/server/lib/types";
import { json, messageSchema } from "@/server/lib/utils";

const route = createRoute({
	tags: ["auth"],
	path: "/logout",
	method: "post",
	responses: {
		200: json.response("Logged out", messageSchema),
		400: json.badRequest(),
	},
});

const handler: HonoHandler<typeof route> = async (c) => {
	const session = c.get("session");
	if (!session) {
		return c.json({ message: "User not logged in" }, 400);
	}

	await db.delete(table.session).where(eq(table.session.id, session.id));

	c.set("user", null);
	c.set("session", null);

	deleteCookie(c, SESSION_COOKIE_NAME);

	return c.json({ message: "Logged out" }, 200);
};

export const authLogoutPost = { route, handler };
