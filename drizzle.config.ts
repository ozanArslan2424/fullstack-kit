import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "sqlite",
	schema: "./db/table.ts",
	out: "./db/out",
	dbCredentials: {
		url: "db.sqlite",
	},
});
