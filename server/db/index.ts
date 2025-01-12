import config from "app.config";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

const sqlite = new Database(config.server.db.sqlite);
const db = drizzle({ client: sqlite });

export { db };
export * as table from "./schema";
