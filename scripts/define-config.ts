const defaultConfig = {
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
};

export function defineGeneratorConfig(opts?: Partial<typeof defaultConfig>): typeof defaultConfig {
	return Object.assign({}, defaultConfig, opts);
}
