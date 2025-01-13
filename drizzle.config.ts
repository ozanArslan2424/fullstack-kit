import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "sqlite",
	schema: "./db/table.ts",
	out: "./db/drizzle-out",
	dbCredentials: {
		url: "sqlite.db",
	},
});
