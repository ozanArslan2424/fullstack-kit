import Watcher from "watcher";
import config from "@/pages.config";
import { log } from "@/server/utils";
import { pathToCamelCase, writeGeneratedFile } from "./utils";

// TODO: Add apiRoutes to the watcher
// TODO: Add watcher for the config file
// TODO: Add watcher for loaders

// type WatcherEvent = "add" | "addDir" | "change" | "rename" | "renameDir" | "unlink" | "unlinkDir";
const { pagesDir, pageFileNames, ignoreFilePrefixes, indexPageFolderNames } = config;
log.info("Watching directory:", pagesDir);

const RoutesMap = new Map();
const watcher = new Watcher(pagesDir, {
	recursive: true,
	renameDetection: true,
});
let pagePathsArray: string[] = [];

function checkFile(filePath: string) {
	const path = String(filePath).replace(pagesDir, "");
	const targetParent = path.split("/").slice(0, -1).join("/") as string;
	const targetName = path.split("/").pop() as string;
	const routeKey = pathToCamelCase(targetParent);

	// check the second character of the targetParent to see if it's a hidden file
	const isIgnored = ignoreFilePrefixes.some((prefix) => targetParent.charAt(1) === prefix);
	const matchesPageFile = pageFileNames.some((name) => {
		if (name.startsWith("*")) {
			return targetName.endsWith(name.slice(1));
		}
		return targetName === name;
	});

	const isRouteFile = matchesPageFile && !isIgnored;

	const routePath = indexPageFolderNames.includes(targetParent) ? "/" : targetParent;

	const routeExists = RoutesMap.has(routeKey);

	const routeObject = routeExists
		? RoutesMap.get(routeKey)
		: isRouteFile
			? { path: routePath, name: routeKey }
			: null;

	return { isRouteFile, routeExists, routeKey, routeObject };
}

watcher.on("add", (filePath) => {
	if (filePath.endsWith(".DS_Store")) return null;
	const { isRouteFile, routeExists, routeKey, routeObject } = checkFile(filePath);

	if (isRouteFile && !routeExists) {
		RoutesMap.set(routeKey, routeObject);
		pagePathsArray.push(routeObject.path);
		log.box(`Route '${routeObject.path}' added`);

		writeGeneratedFile(pagePathsArray, RoutesMap);
	}
});

watcher.on("unlink", (filePath) => {
	if (filePath.endsWith(".DS_Store")) return null;
	const { isRouteFile, routeExists, routeKey, routeObject } = checkFile(filePath);

	if (isRouteFile && routeExists) {
		RoutesMap.delete(routeKey);
		pagePathsArray = pagePathsArray.filter((path) => path !== routeObject.path);
		log.box(`Route '${routeObject.path}' removed`);

		writeGeneratedFile(pagePathsArray, RoutesMap);
	}
});

watcher.on("unlinkDir", (dirPath) => {
	const key = pathToCamelCase(dirPath);
	const routeData = RoutesMap.get(key);
	if (routeData) {
		RoutesMap.delete(key);
		pagePathsArray = pagePathsArray.filter((path) => path !== routeData.path);
		log.box("Route removed bc dir deleted");

		writeGeneratedFile(pagePathsArray, RoutesMap);
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
		log.box(`Route '${routeObject.path}' removed`);

		writeGeneratedFile(pagePathsArray, RoutesMap);
	}

	if (newIsRouteFile && !newRouteExists) {
		RoutesMap.set(newRouteKey, newRouteObject);
		pagePathsArray.push(newRouteObject.path);
		log.box(`Route renamed to '${newRouteObject.path}'`);

		writeGeneratedFile(pagePathsArray, RoutesMap);
	}
});

watcher.on("error", (err) => {
	log.error("Watcher error:", err);
});

process.on("SIGINT", () => {
	watcher.close();
	process.exit(0);
});
