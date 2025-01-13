import config from "@/app.config";
import { watchSchemaFiles } from "@/scripts/watch-zod";
import { watchConfig } from "./watch-metadata";
import { watchRoutes } from "./watch-routes";

const root = process.cwd() + "/";
const serverSource = config.routes.serverSourceFolder.replace(root, "");
const clientSource = config.routes.clientSourceFolder.replace(root, "");

console.log("Watching for changes...");

const configCleanup = await watchConfig(config.metadata);

const schemaCleanup = await watchSchemaFiles({
	zodFile: config.db.zodSourceFile,
	outFile: config.db.outFile,
});

const routesCleanup = await watchRoutes({
	serverDir: serverSource,
	clientDir: clientSource,
	outFile: config.routes.outFile,
});

process.on("exit", () => {
	configCleanup();
	schemaCleanup();
	routesCleanup();
});
