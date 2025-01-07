import { makePath } from "./utils";

const defaults = {
	rootDir: "",
	ignoreFilePrefixes: ["_", "."],
	generatedFilePath: "/client/routes.gen.ts",
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
};

type PagesConfig = typeof defaults;
type PagesConfigOptions = {
	rootDir?: string;
	ignoreFilePrefixes?: string[];
	generatedFilePath?: string;
	client?: {
		routesDir?: string;
		routeFileNames?: string[];
		loaderFileNames?: string[];
		indexRouteDirNames?: string[];
	};
	server?: {
		routesDir?: string;
		routePrefix?: string;
	};
};

export function defineRoutesConfig(config: PagesConfigOptions): PagesConfig {
	const rootDir = process.cwd();

	const ignoreFilePrefixes = config.ignoreFilePrefixes || defaults.ignoreFilePrefixes;
	const generatedFilePath =
		"/" + makePath(rootDir, config.generatedFilePath || defaults.generatedFilePath);

	const client = {
		routesDir: "/" + makePath(rootDir, config.client?.routesDir || defaults.client.routesDir),
		routeFileNames: config.client?.routeFileNames || defaults.client.routeFileNames,
		loaderFileNames: config.client?.loaderFileNames || defaults.client.loaderFileNames,
		indexRouteDirNames: config.client?.indexRouteDirNames || defaults.client.indexRouteDirNames,
	};

	const server = {
		routesDir: "/" + makePath(rootDir, config.server?.routesDir || defaults.server.routesDir),
		routePrefix: config.server?.routePrefix || defaults.server.routePrefix,
	};

	return {
		rootDir,
		ignoreFilePrefixes,
		generatedFilePath,
		client,
		server,
	};
}
