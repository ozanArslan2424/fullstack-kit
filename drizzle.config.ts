import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "sqlite",
	schema: "./db/schema.ts",
	out: "./db/drizzle-out",
	dbCredentials: {
		url: "./db/sqlite.db",
	},
});
