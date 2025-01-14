import { unwatchFile, watchFile } from "fs";
import { join } from "path";
import { AppConfig } from "./define-config";

async function readFile(path: string): Promise<string> {
	return await Bun.file(path).text();
}

async function initializeContents(config: AppConfig) {
	const zodContent = await readFile(config.db.zodSourceFile);
	const metadata = await readFile(join(process.cwd(), "app.config.ts"));

	const metadataRegex = /\{\s*title:\s*"[^"]*",\s*description:\s*"[^"]*"[^}]*\}/;

	const metadataMatch = metadata.match(metadataRegex)![0];

	const metadataContent = `// Auto-generated file. Do not edit.\n export const metadata = ${metadataMatch};`;

	await Bun.write(config.metadata.outFile, metadataContent);
	await Bun.write(config.db.outFile, zodContent);
}

function setupWatchers(config: AppConfig) {
	const configPath = join(process.cwd(), "app.config.ts");
	const watchers = new Set<string>();

	// Config file watcher
	const handleConfigChange = async (curr: any, prev: any) => {
		if (curr.mtime !== prev.mtime) {
			delete require.cache[configPath];

			const metadata = await readFile(join(process.cwd(), "app.config.ts"));

			const metadataRegex = /\{\s*title:\s*"[^"]*",\s*description:\s*"[^"]*"[^}]*\}/;

			const metadataMatch = metadata.match(metadataRegex)![0];

			console.log(metadataMatch);

			const metadataContent = `// Auto-generated file. Do not edit.\n export const metadata = ${metadataMatch};`;

			await Bun.write(config.metadata.outFile, metadataContent);
		}
	};

	// Zod file watcher
	const handleZodChange = async (curr: any, prev: any) => {
		if (curr.mtime !== prev.mtime) {
			const zodContent = await readFile(config.db.zodSourceFile);
			await Bun.write(config.db.outFile, zodContent);
		}
	};

	// Set up watchers and track them
	watchFile(configPath, handleConfigChange);
	watchFile(config.db.zodSourceFile, handleZodChange);

	watchers.add(configPath);
	watchers.add(config.db.zodSourceFile);

	// Return cleanup function
	return () => {
		for (const path of watchers) {
			if (path === configPath) {
				unwatchFile(path, handleConfigChange);
			} else if (path === config.db.zodSourceFile) {
				unwatchFile(path, handleZodChange);
			}
		}
		watchers.clear();
	};
}

export async function watchFiles(config: AppConfig) {
	await initializeContents(config);
	const cleanup = setupWatchers(config);

	// Return cleanup function
	return cleanup;
}
