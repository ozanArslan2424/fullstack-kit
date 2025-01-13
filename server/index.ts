import { apiReference } from "@scalar/hono-api-reference";
import { serveStatic } from "hono/bun";
import { requestId } from "hono/request-id";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import pkg from "@/package.json";
import "@/scripts/watch-all";
import { createRouter } from "@/server/lib/create-router";
import { env } from "@/server/lib/env";
import { log } from "@/server/lib/log";
import { logger } from "@/server/middleware/pino-logger";
import { authRoutes } from "@/server/routes/auth";
import { authCheck } from "./middleware/auth-check";

const apiRoutes = createRouter()
	.basePath("/api")
	.route("/auth", authRoutes)
	.doc("/admin/doc", {
		openapi: "3.0.0",
		info: {
			title: pkg.name,
			version: pkg.version,
		},
	})
	.get(
		"/admin/reference",
		apiReference({
			theme: "kepler",
			layout: "classic",
			defaultHttpClient: {
				targetKey: "javascript",
				clientKey: "fetch",
			},
			spec: {
				url: "/api/admin/doc",
			},
		}),
	);

const app = createRouter()
	.notFound(notFound)
	.onError(onError)
	.use(serveEmojiFavicon("🔥"))
	.use(requestId())
	.use(logger())
	.use(authCheck)
	.route("/", apiRoutes)
	.get("*", serveStatic({ root: "/dist" }))
	.get("*", serveStatic({ path: "/dist/index.html" }));

log.clear();
log.start("🚀 Let's go!");
export default {
	fetch: app.fetch,
	port: Number(env.PORT) || 3000,
};
