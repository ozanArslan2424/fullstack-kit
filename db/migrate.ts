import config from "app.config";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from "@/db";
import { log } from "@/lib/log";

migrate(db, { migrationsFolder: config.db.out });
log.success("migrate.ts ran successfully");
