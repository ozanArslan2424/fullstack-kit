const defaults = {
	rootDir: "",
	pagesDir: "/client/pages/",
	pageFileNames: ["index.tsx", "page.tsx", "*.page.tsx"],
	loaderFileNames: ["loader.tsx", "*.loader.tsx"],
	ignoreFilePrefixes: ["_", "."],
	generatedFilePath: "/client/pages.gen.ts",
	indexPageFolderNames: ["index", "root", "landing"],
};

type PagesConfig = {
	pagesDir: string;
	generatedFilePath: string;
	pageFileNames: string[];
	loaderFileNames: string[];
	ignoreFilePrefixes: string[];
	indexPageFolderNames: string[];
};
type PagesConfigOptions = Partial<typeof defaults>;

function removeSlash(str: string, place: "start" | "end"): string {
	if (place === "start") {
		return str.startsWith("/") ? str.slice(1) : str;
	}
	return str.endsWith("/") ? str.slice(0, -1) : str;
}

function addSlash(str: string, place: "start" | "end"): string {
	if (place === "start") {
		return str.startsWith("/") ? str : "/" + str;
	}
	return str.endsWith("/") ? str : str + "/";
}

export function definePagesConfig(config: PagesConfigOptions): PagesConfig {
	const rootDir = removeSlash(process.cwd() + (config.rootDir || defaults.rootDir), "end");
	const pagesDir = rootDir + addSlash(config.pagesDir || defaults.pagesDir, "start");
	const generatedFilePath =
		rootDir + addSlash(config.generatedFilePath || defaults.generatedFilePath, "start");

	const pageFileNames = config.pageFileNames || defaults.pageFileNames;
	const indexPageFolderNames = config.indexPageFolderNames || defaults.indexPageFolderNames;
	const loaderFileNames = config.loaderFileNames || defaults.loaderFileNames;
	const ignoreFilePrefixes = config.ignoreFilePrefixes || defaults.ignoreFilePrefixes;

	const conf = {
		pagesDir,
		pageFileNames,
		indexPageFolderNames,
		loaderFileNames,
		generatedFilePath,
		ignoreFilePrefixes,
	};
	return conf;
}
