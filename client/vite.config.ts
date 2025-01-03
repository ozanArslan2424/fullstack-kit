import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { dependencies } from "./package.json";

export default defineConfig(({ mode }) => {
	console.log("Vite is running in", mode, "mode");
	return {
		plugins: [react(), tailwindcss(), tsConfigPaths()],
		server: {
			proxy: {
				"/api": "http://localhost:3000",
			},
		},
		optimizeDeps: {
			include: Object.keys(dependencies),
			exclude: ["lightningcss", "@tailwindcss"],
		},
		build: {
			outDir: "../dist",
			cssMinify: "lightningcss",
			manifest: true,
			emptyOutDir: true,
		},
		envDir: "../",
	};
});
