import { defineAppConfig } from "./scripts/define-config";

export default defineAppConfig({
	generated: {
		path: "/generated.ts",
		ignoredPrefixes: ["_", "."],
	},
	client: {
		path: "/client",
		routes: {
			path: "/client/pages",
			routeFileNames: ["index.tsx", "page.tsx", "*.page.tsx"],
			loaderFileNames: ["loader.tsx", "*.loader.tsx"],
			indexRouteDirNames: ["index", "root", "landing"],
		},
	},
	server: {
		path: "/server",
		routes: {
			path: "/server/routes",
			basePath: "/api",
		},
		db: {
			path: "/server/db",
			schema: "/server/db/schema.ts",
			out: "/server/db/drizzle-out",
			sqlite: "/sqlite.db",
		},
	},
	lib: { path: "/lib" },
});
