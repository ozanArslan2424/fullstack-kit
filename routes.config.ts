import { defineRoutesConfig } from "@/watcher/define-config";

export default defineRoutesConfig({
	ignoreFilePrefixes: ["_", "."],
	generatedFilePath: "/routes.gen.ts",
	server: {
		routesDir: "/server/routes/",
		routePrefix: "/api",
	},
	client: {
		routesDir: "/client/pages/",
		routeFileNames: ["index.tsx", "page.tsx", "*.page.tsx"],
		loaderFileNames: ["loader.tsx", "*.loader.tsx"],
		indexRouteDirNames: ["index", "root", "landing"],
	},
});
