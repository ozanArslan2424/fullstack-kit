import { serveStatic } from "hono/bun";
import { createApp } from "@/server/lib/create-app";
import { log } from "@/server/lib/utils";
import { authRoutes } from "@/server/routes/auth";
import "@/watcher/watch-pages";
import "@/watcher/watch-routes";

//*------------------------------------------ App setup
const app = createApp();

log.start("🚀 Let's go!");

//*------------------------------------------ API Routes
app.basePath("/api").route("/auth", authRoutes);

//*------------------------------------------ Static Routes
app.get("*", serveStatic({ root: "./dist" }));
app.get("*", serveStatic({ path: "./dist/index.html" }));

//*------------------------------------------ Start the server
export default {
	port: 3000,
	fetch: app.fetch,
};
