import { HonoContext } from "@/server/types";

export async function profileLogic(c: HonoContext) {
	const user = c.get("user");
	if (!user) {
		return c.json({ message: "User not logged in" }, 401);
	}
	return c.json(user, 200);
}
