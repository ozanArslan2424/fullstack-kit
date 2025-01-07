import { Hono } from "hono";
import { logger } from "hono/logger";
import { HonoType } from "@/server/types";
import { authCheck } from "./middleware/auth-check";
import { serveEmojiFavicon } from "./middleware/emoji-favicon";
import { notFound } from "./middleware/not-found";
import { onError } from "./middleware/on-error";

export function createRouter() {
	return new Hono<HonoType>();
}

export function createApp() {
	const router = new Hono<HonoType>();
	router.use(logger());
	router.use(serveEmojiFavicon("🚀"));
	router.notFound(notFound);
	router.onError(onError);
	router.use(authCheck);

	return router;
}
