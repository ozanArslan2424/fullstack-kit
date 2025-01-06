import { Hono } from "hono";
import { logger } from "hono/logger";
import { authCheck } from "./auth-check";
import { serveEmojiFavicon } from "./emoji-favicon";
import { notFound } from "./not-found";
import { onError } from "./on-error";
import { HonoType } from "./types";

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
