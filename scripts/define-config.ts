function makePath(path: string) {
	const root = process.cwd();
	const rootPath = root.endsWith("/") ? root.slice(0, -1) : root;
	const pathPath = path.startsWith("/") ? path.slice(1) : path;
	return rootPath + "/" + pathPath;
}

export type AppConfig = {
	routes: {
		clientSourceFolder: string;
		clientRouteFileName: string;
		serverSourceFolder: string;
		serverBasePath: string;
		ignoredPrefixes: string[];
		indexRouteDirName: string;
		outFile: string;
	};
	db: {
		drizzleOutFolder: string;
		tableSourceFile: string;
		zodSourceFile: string;
		outFile: string;
	};
	metadata: {
		title: string;
		description: string;
		outFile: string;
	};
};

export function defineAppConfig(config: Partial<AppConfig> = {}): AppConfig {
	return {
		metadata: {
			title: config.metadata?.title ?? "Kit",
			description: config.metadata?.description ?? "A starter kit for building web apps.",
			outFile: makePath(config.metadata?.outFile ?? "client/generated/metadata.ts"),
		},
		routes: {
			clientSourceFolder: makePath(config.routes?.clientSourceFolder ?? "client/pages"),
			clientRouteFileName: config.routes?.clientRouteFileName ?? "index.tsx",
			serverSourceFolder: makePath(config.routes?.serverSourceFolder ?? "server/routes"),
			serverBasePath: config.routes?.serverBasePath ?? "/api",
			ignoredPrefixes: config.routes?.ignoredPrefixes ?? ["_"],
			indexRouteDirName: config.routes?.indexRouteDirName ?? "root",
			outFile: makePath(config.routes?.outFile ?? "client/generated/routes.ts"),
		},
		db: {
			drizzleOutFolder: makePath(config.db?.drizzleOutFolder ?? "/db/drizzle-out"),
			tableSourceFile: makePath(config.db?.tableSourceFile ?? "/db/table.ts"),
			zodSourceFile: makePath(config.db?.zodSourceFile ?? "/db/zod.ts"),
			outFile: makePath(config.db?.outFile ?? "client/generated/zod.ts"),
		},
	};
}
