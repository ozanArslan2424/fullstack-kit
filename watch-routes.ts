import Watcher from "watcher";
import { env } from "@/server/lib/env";
import { log } from "@/server/lib/log";

// TODO: Add apiRoutes to the watcher
// type WatcherEvent = "add" | "addDir" | "change" | "rename" | "renameDir" | "unlink" | "unlinkDir";

function pathToCamelCase(str: string): string {
	return str.replaceAll("/", "-").replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

const rootDir = import.meta.dir;
const pagesDir = env.PAGES_DIR_PATH || "/client/src/pages";
const watchedDir = rootDir + pagesDir;
const configPath = env.CONFIG_FILE_PATH || "/client/src";
const configFile = rootDir + configPath + "/config.ts";

log.info("Watching directory:", watchedDir);

const RoutesMap = new Map();
const watcher = new Watcher(watchedDir, {
	recursive: true,
	renameDetection: true,
});
let pagePathsArray: string[] = [];

function checkFile(filePath: string) {
	const path = String(filePath).replace(watchedDir, "");
	const targetParent = path.split("/").slice(0, -1).join("/") as string;
	const targetName = path.split("/").pop() as string;
	const routeKey = pathToCamelCase(targetParent);

	const isRouteFile = targetName === "index.tsx" && !targetParent.startsWith("/_");
	const routeExists = RoutesMap.has(routeKey);

	const routeObject = routeExists
		? RoutesMap.get(routeKey)
		: isRouteFile
			? {
					path: targetParent === "/root" ? "/" : targetParent,
					name: routeKey,
				}
			: null;

	return { isRouteFile, routeExists, routeKey, routeObject };
}

function writeTypes() {
	const content = `
// Path: ${configFile}\n
// Auto-generated by watch-pages.ts\n
declare global { type ClientRoutePath = ${pagePathsArray.map((path) => `"${path}"`).join(" | ")}; type ExtractRouteParams<T> = T extends \`\${infer _Start}:\${infer Param}/\${infer Rest}\`\n ? { [k in Param | keyof ExtractRouteParams<Rest>]: string } : T extends \`\${infer _Start}:\${infer Param}\` ? { [k in Param]: string } : { [k in string]: string }; type ExtractSearchParams<P> = P extends \`\${infer _Start}?\${infer Search}\` ? { [k in Search]: string } : { [k in string]: string }; type ClientRoutePathParam<P extends ClientRoutePath> = ExtractRouteParams<P>; type ClientRouteSearchParam<P extends ClientRoutePath> = ExtractSearchParams<P>; }\n
export const RoutesMap = ${JSON.stringify(Object.fromEntries(RoutesMap))};\n
export const pagePaths:ClientRoutePath[] = ${JSON.stringify(pagePathsArray)};
`;
	Bun.write(configFile, content);
}

watcher.on("add", (filePath) => {
	if (filePath.endsWith(".DS_Store")) return null;
	const { isRouteFile, routeExists, routeKey, routeObject } = checkFile(filePath);

	if (isRouteFile && !routeExists) {
		RoutesMap.set(routeKey, routeObject);
		pagePathsArray.push(routeObject.path);
		log.box(
			`Route '${routeObject.path}' added`,
			// "\nRoutesMap:",
			// RoutesMap,
			"\npagePathsArray:",
			pagePathsArray,
		);

		writeTypes();
	}
});

watcher.on("unlink", (filePath) => {
	if (filePath.endsWith(".DS_Store")) return null;
	const { isRouteFile, routeExists, routeKey, routeObject } = checkFile(filePath);

	if (isRouteFile && routeExists) {
		RoutesMap.delete(routeKey);
		pagePathsArray = pagePathsArray.filter((path) => path !== routeObject.path);
		log.box(
			`Route '${routeObject.path}' removed`,
			// "\nRoutesMap:",
			// RoutesMap,
			"\npagePathsArray:",
			pagePathsArray,
		);

		writeTypes();
	}
});

watcher.on("unlinkDir", (dirPath) => {
	const key = pathToCamelCase(dirPath);
	const routeData = RoutesMap.get(key);
	if (routeData) {
		RoutesMap.delete(key);
		pagePathsArray = pagePathsArray.filter((path) => path !== routeData.path);
		log.box(
			"Route removed bc dir deleted",
			// "\nRoutesMap:",
			// RoutesMap,
			"\npagePathsArray:",
			pagePathsArray,
		);

		writeTypes();
	}
});

watcher.on("rename", (filePath, newFilePath) => {
	if (filePath.endsWith(".DS_Store")) return null;
	const { isRouteFile, routeExists, routeKey, routeObject } = checkFile(filePath);
	const {
		isRouteFile: newIsRouteFile,
		routeExists: newRouteExists,
		routeKey: newRouteKey,
		routeObject: newRouteObject,
	} = checkFile(newFilePath);

	if (isRouteFile && routeExists) {
		RoutesMap.delete(routeKey);
		pagePathsArray = pagePathsArray.filter((path) => path !== routeObject.path);
		log.box(
			`Route '${routeObject.path}' removed`,
			// "\nRoutesMap:",
			// RoutesMap,
			"\npagePathsArray:",
			pagePathsArray,
		);

		writeTypes();
	}

	if (newIsRouteFile && !newRouteExists) {
		RoutesMap.set(newRouteKey, newRouteObject);
		pagePathsArray.push(newRouteObject.path);
		log.box(
			`Route renamed to '${newRouteObject.path}'`,
			// "\nRoutesMap:",
			// RoutesMap,
			"\npagePathsArray:",
			pagePathsArray,
		);

		writeTypes();
	}
});

watcher.on("error", (err) => {
	log.error("Watcher error:", err);
});

process.on("SIGINT", () => {
	watcher.close();
	process.exit(0);
});