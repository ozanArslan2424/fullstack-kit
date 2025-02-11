import { unwatchFile, watchFile } from "fs";
import { join } from "path";
import config from "@/app.config";

const cwd = process.cwd();
const routesOutFile = join(cwd, config.outFiles.routeTypes);
const zodOutFile = join(cwd, config.outFiles.zod);

const watchedServerFile = join(cwd, config.watchedFiles.serverEntryFile);
const watchedClientFile = join(cwd, config.watchedFiles.clientPathsFile);
const watchedZodFile = join(cwd, config.watchedFiles.zodFile);

let serverRoutes: string[] = [];
let clientRoutes: string[] = [];

async function watchServerRoutes(watched: string, onChange: (paths: string[]) => void) {
	async function collectPaths() {
		const cacheKey = require.resolve("@/server/index");
		if (cacheKey && require.cache[cacheKey]) {
			delete require.cache[cacheKey];
		}
		const module = await import("@/server/index");
		return module.app.routes
			.filter((route) => route.path !== "/*")
			.filter((route) => !route.path.startsWith("/api/admin"))
			.map((route) => route.path);
	}

	let array: string[] = await collectPaths();

	watchFile(watched, async (curr, prev) => {
		if (curr.mtime !== prev.mtime) {
			array = await collectPaths();
			onChange(array);
		}
	});

	return array;
}

async function watchClientRoutes(watched: string, onChange: (paths: string[]) => void) {
	async function collectPaths() {
		const cacheKey = require.resolve("@/client/routes/paths");
		if (cacheKey && require.cache[cacheKey]) {
			delete require.cache[cacheKey];
		}
		const module = await import("@/client/routes/paths");
		const paths = module.paths;

		const collected: string[] = [];
		Object.values(paths).forEach((path) => {
			if (typeof path === "object" && path !== null) {
				Object.values(path).forEach((subPath) => {
					collected.push(subPath as string);
				});
			} else {
				collected.push(path as string);
			}
		});
		return collected;
	}

	let array: string[] = await collectPaths();

	watchFile(watched, async (curr, prev) => {
		if (curr.mtime !== prev.mtime) {
			array = await collectPaths();
			onChange(array);
		}
	});

	return array;
}

async function watchZod(path: string, onChange: (content: string) => void) {
	async function getContents() {
		return await Bun.file(path).text();
	}

	let content: string = await getContents();

	watchFile(path, async (curr, prev) => {
		if (curr.mtime !== prev.mtime) {
			content = "// Auto-generated file. Do not edit.\n" + (await getContents());
			onChange(content);
		}
	});

	return content;
}

function genContent() {
	const serverGlobalTypes = `
type ServerRoutePath = ${[...serverRoutes].map((path) => `"${path}"`).join(" | ")};
type ServerRoutePathParam<P extends ServerRoutePath> = ExtractRouteParams<P>;
type ServerRouteSearchParam<P extends ServerRoutePath> = ExtractSearchParams<P>;
`;

	const clientGlobalTypes = `
type ClientRoutePath = ${[...clientRoutes].map((path) => `"${path}"`).join(" | ")};
type ClientRoutePathParam<P extends ClientRoutePath> = ExtractRouteParams<P>;
type ClientRouteSearchParam<P extends ClientRoutePath> = ExtractSearchParams<P>;
`;

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
}

export const clientRoutePaths:ClientRoutePath[] = ${JSON.stringify([...clientRoutes], null, 2)};
export const serverRoutePaths:ServerRoutePath[] = ${JSON.stringify([...serverRoutes], null, 2)};
`;

	return content;
}

Bun.write(zodOutFile, await Bun.file(watchedZodFile).text());

watchServerRoutes(watchedServerFile, (paths) => {
	serverRoutes = paths;
	Bun.write(routesOutFile, genContent());
});

watchClientRoutes(watchedClientFile, (paths) => {
	clientRoutes = paths;
	Bun.write(routesOutFile, genContent());
});

watchZod(watchedZodFile, (content) => {
	Bun.write(zodOutFile, content);
});

process.on("SIGINT", () => {
	unwatchFile(watchedServerFile);
	unwatchFile(watchedClientFile);
	unwatchFile(watchedZodFile);
});
