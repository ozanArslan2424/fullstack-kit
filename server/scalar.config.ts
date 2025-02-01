import { ApiReferenceOptions } from "@scalar/hono-api-reference";
import pkg from "@/package.json";

export const uiConfig: ApiReferenceOptions = {
	theme: "kepler",
	layout: "classic",
	defaultHttpClient: {
		targetKey: "js",
		clientKey: "fetch",
	},
	spec: {
		url: "/admin/doc",
	},
};

export const openapiConfig = {
	openapi: "3.0.0",
	info: {
		title: pkg.name,
		version: pkg.version,
	},
};
