import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import type { SessionSelect, UserSelect } from "@/server/db/types";
import { authCheck } from "@/server/middleware/auth-check";
import { serveEmojiFavicon } from "@/server/middleware/emoji-favicon";
import { notFound } from "@/server/middleware/not-found";
import { onError } from "@/server/middleware/on-error";
import { authRoutes } from "@/server/routes/auth";
import "@/watch-routes";
import { log } from "./lib/log";

export interface HonoType {
	Variables: {
		user: UserSelect | null;
		session: SessionSelect | null;
	};
}
//*------------------------------------------ App setup
const hono = new Hono<HonoType>();
log.clear();
log.start("🚀 Let's go!");

//*------------------------------------------ Middlewares
export const middlewares = hono
	.use(logger())
	.use(serveEmojiFavicon("🚀"))
	.notFound(notFound)
	.onError(onError);

//*------------------------------------------ API Routes
export const apiRoutes = hono.basePath("/api").use(authCheck).route("/auth", authRoutes);

//*------------------------------------------ Static Routes
hono.get("*", serveStatic({ root: "./client/dist" }));
hono.get("*", serveStatic({ path: "./client/dist/index.html" }));

//*------------------------------------------ Start the server
export default {
	port: 3000,
	fetch: hono.fetch,
};
