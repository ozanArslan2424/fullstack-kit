import { serveStatic } from "hono/bun";
import { env } from "@/lib/env";
import { log } from "@/lib/log";
import { configureMiddleware } from "@/server/lib/configure-middleware";
import { configureOpenAPI } from "@/server/lib/configure-openapi";
import { createRouter } from "@/server/lib/create-router";
import { authRoutes } from "@/server/routes/auth";
import "@/watcher/watch-routes";

const app = createRouter().basePath("/api");

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
