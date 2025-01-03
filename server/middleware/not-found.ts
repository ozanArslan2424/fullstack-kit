import type { NotFoundHandler } from "hono";

export const notFound: NotFoundHandler = (c) => {
	// Return a JSON response with a "Not Found" message and the requested path
	return c.json({ message: `Path '${c.req.path}' is not found.` }, 404);
};
