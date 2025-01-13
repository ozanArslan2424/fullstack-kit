import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import config from "@/app.config";
import { log } from "@/server/lib/log";
import { db } from ".";

migrate(db, { migrationsFolder: config.db.drizzleOutFolder });
log.success("migrate.ts ran successfully");
