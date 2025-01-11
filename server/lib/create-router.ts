import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "stoker/openapi";
import { HonoBindings } from "@/server/lib/types";

export function createRouter() {
	const app = new OpenAPIHono<HonoBindings>({
		strict: false,
		defaultHook,
	});

	return app;
}
