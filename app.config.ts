import { defineAppConfig } from "./scripts/define-config";

export default defineAppConfig({
	routes: {
		clientSourceFolder: "/client/pages",
		clientRouteFileName: "index.tsx",
		serverSourceFolder: "/server/routes",
		serverBasePath: "/api",
		ignoredPrefixes: ["_"],
		indexRouteDirName: "root",

		outFile: "/client/generated/routes.ts",
	},
	db: {
		drizzleOutFolder: "/db/drizzle-out",
		tableSourceFile: "/db/table.ts",
		zodSourceFile: "/db/zod.ts",
		outFile: "/client/generated/zod.ts",
	},
	metadata: {
		title: "Bun Hono React Kit",
		description: "A starter kit for building web apps.",
		outFile: "/client/generated/metadata.ts",
	},
});
