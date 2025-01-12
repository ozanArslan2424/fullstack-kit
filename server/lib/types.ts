import { OpenAPIHono, type RouteConfig, type RouteHandler } from "@hono/zod-openapi";
import { Context } from "hono";
import { PinoLogger } from "hono-pino";
import { ProfileGetType, SessionGetType } from "@/lib/types";

export interface HonoBindings {
	Variables: {
		logger: PinoLogger;
		user: ProfileGetType | null;
		session: SessionGetType | null;
	};
}

export type HonoApp = OpenAPIHono<HonoBindings>;
export type HonoContext = Context<HonoBindings>;
export type HonoHandler<R extends RouteConfig> = RouteHandler<R, HonoBindings>;
