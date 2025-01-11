import { createRoute } from "@hono/zod-openapi";
import { profileGetSchema } from "@/db/zod";
import { HonoHandler } from "@/server/lib/types";
import { json } from "@/server/lib/utils";

const route = createRoute({
	tags: ["auth"],
	path: "/profile",
	method: "get",
	responses: {
		200: json.response("User profile", profileGetSchema),
		401: json.unauthorized(),
	},
});

const handler: HonoHandler<typeof route> = async (c) => {
	const user = c.get("user");
	if (!user) {
		return c.json({ message: "User not logged in" }, 401);
	}
	return c.json(user, 200);
};

export const authProfileGet = { route, handler };
