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
	},
	db: {
		path: root + "/db",
		schema: root + "/db/schema.ts",
		out: root + "/db/drizzle-out",
		sqlite: root + "/sqlite.db",
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
	};
	db?: {
		path?: string;
		schema?: string;
		out?: string;
		sqlite?: string;
	};
	lib?: {
		path?: string;
	};
};

export function defineAppConfig(config?: AppConfigOptions): AppConfig {
	const generatedPath = root + config?.generated?.path || defaults.generated.path;
	const clientPath = root + config?.client?.path || defaults.client.path;
	const clientRoutesPath = root + config?.client?.routes?.path || defaults.client.routes.path;
	const ignoredPrefixes =
		config?.generated?.ignoredPrefixes || defaults.generated.ignoredPrefixes;
	const routeFileNames =
		config?.client?.routes?.routeFileNames || defaults.client.routes.routeFileNames;
	const loaderFileNames =
		config?.client?.routes?.loaderFileNames || defaults.client.routes.loaderFileNames;
	const indexRouteDirNames =
		config?.client?.routes?.indexRouteDirNames || defaults.client.routes.indexRouteDirNames;

	const serverPath = root + config?.server?.path || defaults.server.path;
	const serverRoutesPath = root + config?.server?.routes?.path || defaults.server.routes.path;
	const basePath = config?.server?.routes?.basePath || defaults.server.routes.basePath;

	const dbPath = root + config?.db?.path || defaults.db.path;
	const schema = root + config?.db?.schema || defaults.db.schema;
	const out = root + config?.db?.out || defaults.db.out;
	const sqlite = root + config?.db?.sqlite || defaults.db.sqlite;

	const libPath = root + config?.lib?.path || defaults.lib.path;

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
		},
		db: {
			path: dbPath,
			schema,
			out,
			sqlite,
		},
		lib: {
			path: libPath,
		},
	};
}
