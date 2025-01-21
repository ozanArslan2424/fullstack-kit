import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { log } from "@/server/lib/log";
import { db } from ".";

migrate(db, { migrationsFolder: "./drizzle-out" });
log.success("migrate.ts ran successfully");
