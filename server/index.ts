import { ApiReferenceOptions, apiReference } from "@scalar/hono-api-reference";
import { serveStatic } from "hono/bun";
import { requestId } from "hono/request-id";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import pkg from "@/package.json";
import { createRouter } from "@/server/lib/create-router";
import { env } from "@/server/lib/env";
import { log } from "@/server/lib/log";
import { logger } from "@/server/middleware/pino-logger";
import { authRoutes } from "@/server/routes/auth";
import { authCheck } from "./middleware/auth-check";

const refOpts: ApiReferenceOptions = {
	theme: "kepler",
	layout: "classic",
	defaultHttpClient: {
		targetKey: "javascript",
		clientKey: "fetch",
	},
	spec: {
		url: "/api/admin/doc",
	},
};

const docOpts = {
	openapi: "3.0.0",
	info: {
		title: pkg.name,
		version: pkg.version,
	},
};

export const app = createRouter();
app.notFound(notFound);
app.onError(onError);
app.use(serveEmojiFavicon("🚀"));
app.use(requestId());
app.use(logger());
app.use(authCheck);

app.route("/api/auth", authRoutes);
app.doc("/api/admin/doc", docOpts);
app.get("/api/admin/ref", apiReference(refOpts));

app.get("*", serveStatic({ root: "/dist" }));
app.get("*", serveStatic({ path: "/dist/index.html" }));

log.clear();
log.start("🚀 Let's go!");

export default {
	fetch: app.fetch,
	port: Number(env.PORT) || 3000,
};
