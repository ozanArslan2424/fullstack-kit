import { watchFile } from "fs";
import { join } from "path";
import { AppConfig } from "./define-config";

async function writeMetadataFile(metadata: AppConfig["metadata"]) {
	const meta = {
		title: metadata.title,
		description: metadata.description,
	};
	const content = `// Auto-generated file. Do not edit.
export const metadata = ${JSON.stringify(meta, null, 2)};
`;
	await Bun.write(metadata.outFile, content);
}

export async function watchConfig(metadata: AppConfig["metadata"]) {
	const configPath = join(process.cwd(), "app.config.ts");

	await writeMetadataFile(metadata);

	watchFile(configPath, async (curr, prev) => {
		if (curr.mtime !== prev.mtime) {
			delete require.cache[configPath];

			const freshConfig = (await import(configPath)) as { default: AppConfig };

			await writeMetadataFile(freshConfig.default.metadata);
		}
	});

	return () => {
		console.log("\nStopping config watcher...");
		watchFile(configPath, () => {});
	};
}
