import { apiReference } from "@scalar/hono-api-reference";
import pkg from "@/package.json";
import { HonoApp } from "./types";

export function configureOpenAPI(app: HonoApp) {
	app.doc("/doc", {
		openapi: "3.0.0",
		info: {
			title: pkg.name,
			version: pkg.version,
		},
	});

	app.get(
		"/reference",
		apiReference({
			theme: "kepler",
			layout: "classic",
			defaultHttpClient: {
				targetKey: "javascript",
				clientKey: "fetch",
			},
			spec: {
				url: "/api/doc",
			},
		}),
	);
}
