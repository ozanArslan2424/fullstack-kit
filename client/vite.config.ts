import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		cssMinify: "lightningcss",
		manifest: true,
		outDir: "../dist",
		emptyOutDir: true,
	},
	server: {
		proxy: {
			"/api": "http://localhost:3000",
		},
	},
	resolve: {
		alias: {
			"@": process.cwd(),
		},
	},
	optimizeDeps: {
		exclude: ["@iconify/react"],
	},
});
