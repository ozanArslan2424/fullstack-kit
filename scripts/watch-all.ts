import config from "@/app.config";
import { watchFiles } from "@/scripts/watch-files";
import { watchRoutes } from "./watch-routes";

const root = process.cwd() + "/";
const serverSource = config.routes.serverSourceFolder.replace(root, "");
const clientSource = config.routes.clientSourceFolder.replace(root, "");

console.log("Watching for changes...");

const filesCleanup = await watchFiles(config);

const routesCleanup = await watchRoutes({
	serverDir: serverSource,
	clientDir: clientSource,
	outFile: config.routes.outFile,
});

process.on("SIGINT", () => {
	filesCleanup();
	routesCleanup();
});
