import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export const onError: ErrorHandler = (err, c) => {
	const currentStatus = "status" in err ? err.status : c.newResponse(null).status;

	const code = currentStatus !== 200 ? (currentStatus as ContentfulStatusCode) : 500;
	const message = err.message || "Internal Server Error";
	const cause = err.cause || "An error occurred";
	const stack = process.env.NODE_ENV === "production" ? undefined : err.stack;

	return c.json({ code, message, cause, stack }, code);
};
