import { createMiddleware } from "hono/factory";

export const serveEmojiFavicon = (emoji: string) =>
	createMiddleware<HonoType>(async (c, next) => {
		if (c.req.path === "/favicon.ico") {
			c.header("Content-Type", "image/svg+xml");
			return c.body(
				`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" x="0em" font-size="90">${emoji}</text></svg>`,
			);
		}
		return next();
	});