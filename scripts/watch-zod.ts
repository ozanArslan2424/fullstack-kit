import { watchFile } from "fs";

interface WatchConfig {
	// drizzleFile: string;
	zodFile: string;
	outFile: string;
}

// interface FileContent {
// 	drizzle: string;
// 	zod: string;
// }

// const content: FileContent = {
// 	drizzle: "",
// 	zod: "",
// };

// function cleanZodImports(text: string): string {
// 	return text.replace(/import\s*{\s*([^}]*)\s*}\s*from\s*["']@\/db\/table["']\s*;?\s*/g, "\n");
// }

async function writeGeneratedFile(config: WatchConfig, content: string) {
	const output = `// Auto-generated file. Do not edit.\n${content}`;
	await Bun.write(config.outFile, output);
}

async function readFile(path: string): Promise<string> {
	return await Bun.file(path).text();
}

async function initializeContents(config: WatchConfig): Promise<void> {
	// content.drizzle = await readFile(config.drizzleFile);
	// content.zod = cleanZodImports(await readFile(config.zodFile));
	const content = await readFile(config.zodFile);
	await writeGeneratedFile(config, content);
}

function setupWatchers(config: WatchConfig) {
	// watchFile(config.drizzleFile, async (curr, prev) => {
	// 	if (curr.mtime !== prev.mtime) {
	// 		content.drizzle = await readFile(config.drizzleFile);
	// 		await writeGeneratedFile(config, content);
	// 	}
	// });

	watchFile(config.zodFile, async (curr, prev) => {
		if (curr.mtime !== prev.mtime) {
			// content.zod = cleanZodImports(await readFile(config.zodFile));
			const content = await readFile(config.zodFile);
			await writeGeneratedFile(config, content);
		}
	});
}

export async function watchSchemaFiles(config: WatchConfig) {
	await initializeContents(config);
	setupWatchers(config);

	return () => {
		// watchFile(config.drizzleFile, () => {});
		watchFile(config.zodFile, () => {});
	};
}
