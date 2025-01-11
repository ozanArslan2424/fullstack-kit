import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

const sqlite = new Database("sqlite.db");
const db = drizzle({ client: sqlite });

export { db };

export * as table from "./schema";
