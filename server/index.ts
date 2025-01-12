import config from "app.config";
import { serveStatic } from "hono/bun";
import { env } from "@/lib/env";
import { log } from "@/lib/log";
import "@/scripts/watch-routes";
import { configureMiddleware } from "@/server/lib/configure-middleware";
import { configureOpenAPI } from "@/server/lib/configure-openapi";
import { createRouter } from "@/server/lib/create-router";
import { authRoutes } from "@/server/routes/auth";

const app = createRouter().basePath(config.server.routes.basePath);

configureOpenAPI(app);
configureMiddleware(app);

log.clear();
log.start("🚀 Let's go!");

app.get("*", serveStatic({ root: "./dist" }));
app.get("*", serveStatic({ path: "./dist/index.html" }));

app.route("/auth", authRoutes);

export default {
	fetch: app.fetch,
	port: Number(env.PORT) || 3000,
};
