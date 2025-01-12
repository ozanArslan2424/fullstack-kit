const root = process.cwd();

const defaults = {
	generated: {
		path: root + "/generated.ts",
		ignoredPrefixes: ["_", "."],
	},
	client: {
		path: root + "/client",
		routes: {
			path: root + "/client/routes",
			routeFileNames: ["index.tsx", "page.tsx", "*.page.tsx"],
			loaderFileNames: ["loader.tsx", "*.loader.tsx"],
			indexRouteDirNames: ["index", "root", "landing"],
		},
	},
	server: {
		path: root + "/server",
		routes: {
			path: root + "/server/routes",
			basePath: "/api",
		},
		db: {
			path: root + "/server/db",
			schema: root + "/server/db/schema.ts",
			out: root + "/server/db/drizzle-out",
			sqlite: root + "/sqlite.db",
		},
	},
	lib: { path: root + "/lib" },
};

type AppConfig = typeof defaults;
type AppConfigOptions = {
	generated?: {
		path?: string;
		ignoredPrefixes?: string[];
	};
	client?: {
		path?: string;
		routes?: {
			path?: string;
			routeFileNames?: string[];
			loaderFileNames?: string[];
			indexRouteDirNames?: string[];
		};
	};
	server?: {
		path?: string;
		routes?: {
			path?: string;
			basePath?: string;
		};
		db?: {
			path?: string;
			schema?: string;
			out?: string;
			sqlite?: string;
		};
	};
	lib?: {
		path?: string;
	};
};

function makePath(path: string) {
	const rootPath = root.endsWith("/") ? root.slice(0, -1) : root;
	const pathPath = path.startsWith("/") ? path.slice(1) : path;
	return rootPath + "/" + pathPath;
}

export function defineAppConfig(config?: AppConfigOptions): AppConfig {
	const generatedPath = makePath(config?.generated?.path || defaults.generated.path);
	const clientPath = makePath(config?.client?.path || defaults.client.path);
	const clientRoutesPath = makePath(config?.client?.routes?.path || defaults.client.routes.path);

	const ignoredPrefixes =
		config?.generated?.ignoredPrefixes || defaults.generated.ignoredPrefixes;
	const routeFileNames =
		config?.client?.routes?.routeFileNames || defaults.client.routes.routeFileNames;
	const loaderFileNames =
		config?.client?.routes?.loaderFileNames || defaults.client.routes.loaderFileNames;
	const indexRouteDirNames =
		config?.client?.routes?.indexRouteDirNames || defaults.client.routes.indexRouteDirNames;

	const serverPath = makePath(config?.server?.path || defaults.server.path);
	const serverRoutesPath = makePath(config?.server?.routes?.path || defaults.server.routes.path);
	const basePath = config?.server?.routes?.basePath || defaults.server.routes.basePath;

	const dbPath = makePath(config?.server?.db?.path || defaults.server.db.path);
	const schema = makePath(config?.server?.db?.schema || defaults.server.db.schema);
	const out = makePath(config?.server?.db?.out || defaults.server.db.out);
	const sqlite = makePath(config?.server?.db?.sqlite || defaults.server.db.sqlite);

	const libPath = makePath(config?.lib?.path || defaults.lib.path);

	return {
		generated: { path: generatedPath, ignoredPrefixes },
		client: {
			path: clientPath,
			routes: {
				path: clientRoutesPath,
				routeFileNames,
				loaderFileNames,
				indexRouteDirNames,
			},
		},
		server: {
			path: serverPath,
			routes: {
				path: serverRoutesPath,
				basePath: basePath,
			},
			db: {
				path: dbPath,
				schema,
				out,
				sqlite,
			},
		},

		lib: {
			path: libPath,
		},
	};
}
