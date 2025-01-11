import { requestId } from "hono/request-id";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { logger } from "@/server/middleware/pino-logger";
import { authCheck } from "../middleware/auth-check";
import { HonoApp } from "./types";

export function configureMiddleware(app: HonoApp) {
	app.notFound(notFound);
	app.onError(onError);
	app.use(serveEmojiFavicon("🔥"));
	app.use(requestId());
	app.use(logger());
	app.use(authCheck);
}
