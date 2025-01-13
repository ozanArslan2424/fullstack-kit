import { EventEmitter } from "events";
import { watch } from "fs";
import { readdir, stat } from "fs/promises";
import { join, parse, relative } from "path";
import config from "@/app.config";

interface RouteInfo {
	path: string;
	method?: string;
	isPage?: boolean;
}

interface WatchConfig {
	serverDir: string;
	clientDir: string;
	outFile: string;
}

function extractServerRouteInfo(filePath: string, baseDir: string): RouteInfo | null {
	const prefix = config.routes.serverBasePath.replace("/", "") || "";
	const relativePath = relative(baseDir, filePath);
	const { dir, name } = parse(relativePath);
	const [routeName, method] = name.split(".");
	if (!method) return null;
	const routePath = join(prefix, dir, routeName)
		.replace(/\\/g, "/")
		.replace(/\[([^\]]+)\]/g, ":$1");

	return {
		path: "/" + routePath,
		method: method.toUpperCase(),
	};
}

function extractClientRouteInfo(filePath: string, baseDir: string): RouteInfo | null {
	const relativePath = relative(baseDir, filePath);
	const { dir, name, ext } = parse(relativePath);
	if (ext !== ".tsx") return null;
	if (name !== "index" && name !== "page") return null;
	if (config.routes.ignoredPrefixes.some((prefix) => dir.startsWith(prefix))) return null;
	const routePath = dir
		.replace(/\\/g, "/")
		.replace(/\[([^\]]+)\]/g, ":$1")
		.replace(config.routes.indexRouteDirName, "");
	return {
		path: "/" + routePath,
		method: "PAGE",
	};
}

async function scanDirectory(dir: string): Promise<string[]> {
	const files: string[] = [];

	async function scan(currentDir: string) {
		const entries = await readdir(currentDir);

		for (const entry of entries) {
			const fullPath = join(currentDir, entry);
			const stats = await stat(fullPath);

			if (stats.isDirectory()) {
				await scan(fullPath);
			} else {
				files.push(fullPath);
			}
		}
	}

	await scan(dir);
	return files;
}

const makeGeneratedFile = (server: RouteInfo[], client: RouteInfo[]) => {
	const routes = [...server, ...client];
	const serverRoutes = server.map((route) => route.path);
	const clientRoutes = client.map((route) => route.path);

	const clientGlobalTypes = `
	type ClientRoutePath = ${[...clientRoutes].map((path) => `"${path}"`).join(" | ")};
	type ClientRoutePathParam<P extends ClientRoutePath> = ExtractRouteParams<P>;
	type ClientRouteSearchParam<P extends ClientRoutePath> = ExtractSearchParams<P>;`;

	const serverGlobalTypes = `
	type ServerRoutePath = ${[...serverRoutes].map((path) => `"${path}"`).join(" | ")};
	type ServerRoutePathParam<P extends ServerRoutePath> = ExtractRouteParams<P>;
	type ServerRouteSearchParam<P extends ServerRoutePath> = ExtractSearchParams<P>;`;

	const content = `
	// Auto-generated file. Do not edit.
	type ExtractRouteParams<T> = T extends \`\${infer _Start}:\${infer Param}/\${infer Rest}\`
		? { [k in Param | keyof ExtractRouteParams<Rest>]: string }
		: T extends \`\${infer _Start}:\${infer Param}\`
			? { [k in Param]: string }
			: { [k in string]: string };
	type ExtractSearchParams<P> = P extends \`\${infer _Start}?\${infer Search}\`
		? { [k in Search]: string }
		: { [k in string]: string };\n
	declare global {
		${clientRoutes.length === 0 ? "" : clientGlobalTypes}
		${serverRoutes.length === 0 ? "" : serverGlobalTypes}
	}\n
	export const clientRoutePaths:ClientRoutePath[] = ${JSON.stringify([...clientRoutes], null, 2)};
	export const serverRoutePaths:ServerRoutePath[] = ${JSON.stringify([...serverRoutes], null, 2)};
	export const routesConfig = ${JSON.stringify(routes, null, 2)};\n
`;

	return content;
};

export async function watchRoutes(config: WatchConfig) {
	const emitter = new EventEmitter();
	const watchers: ReturnType<typeof watch>[] = [];

	async function processRoutes() {
		const [serverFiles, clientFiles] = await Promise.all([
			scanDirectory(config.serverDir),
			scanDirectory(config.clientDir),
		]);

		const serverRoutes = serverFiles
			.map((file) => extractServerRouteInfo(file, config.serverDir))
			.filter((route): route is RouteInfo => route !== null);

		const clientRoutes = clientFiles
			.map((file) => extractClientRouteInfo(file, config.clientDir))
			.filter((route): route is RouteInfo => route !== null);

		const content = makeGeneratedFile(serverRoutes, clientRoutes);
		await Bun.write(config.outFile, content);
	}

	function watchDir(dir: string) {
		const watcher = watch(dir, { recursive: true }, async (eventType, filename) => {
			if (filename) {
				await processRoutes();
			}
		});
		watchers.push(watcher);
	}

	watchDir(config.serverDir);
	watchDir(config.clientDir);

	await processRoutes();

	return () => {
		watchers.forEach((watcher) => watcher.close());
		emitter.removeAllListeners();
	};
}
