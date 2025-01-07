import { eq } from "drizzle-orm";
import { deleteCookie } from "hono/cookie";
import { SESSION_COOKIE_NAME } from "@/lib/constants";
import { db, table } from "@/server/db";
import { HonoContext } from "@/server/types";

export async function logoutLogic(c: HonoContext) {
	const session = c.get("session");
	if (!session) {
		return c.json({ message: "User not logged in" }, 400);
	}

	await db.delete(table.session).where(eq(table.session.id, session.id));

	c.set("user", null);
	c.set("session", null);

	deleteCookie(c, SESSION_COOKIE_NAME);

	return c.json({ message: "Logged out" }, 200);
}
