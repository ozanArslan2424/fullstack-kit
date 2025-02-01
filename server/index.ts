import { apiReference } from "@scalar/hono-api-reference";
import { serveStatic } from "hono/bun";
import { requestId } from "hono/request-id";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { createRouter } from "@/server/lib/create-router";
import { log } from "@/server/lib/log";
import { authCheck } from "@/server/middleware/auth-check";
import { logger } from "@/server/middleware/pino-logger";
import { authRoutes } from "@/server/routes/auth";
import { openapiConfig, uiConfig } from "@/server/scalar.config";

export const app = createRouter()
	.doc("/admin/doc", openapiConfig)
	.get("/admin/ref", apiReference(uiConfig))

	.notFound(notFound)
	.onError(onError)
	.use(serveEmojiFavicon("🚀"))
	.use(requestId())
	.use(logger())
	.use(authCheck)

	.route("/api/auth", authRoutes)

	.get("*", serveStatic({ root: "/dist" }))
	.get("*", serveStatic({ path: "/dist/index.html" }));

// * Start server
log.clear();
log.start("🚀 Let's go!");

export default {
	fetch: app.fetch,
	port: 3000,
};
