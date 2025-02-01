import { defineGeneratorConfig } from "@/scripts/define-config";

export default defineGeneratorConfig({
	watchedFiles: {
		zodFile: "db/zod.ts",
		serverEntryFile: "server/index.ts",
		clientPathsFile: "client/routes/paths.ts",
	},
	outFiles: {
		zod: "client/config/zod.ts",
		metadata: "client/config/metadata.ts",
		routeTypes: "client/config/route-gen.ts",
	},
});
