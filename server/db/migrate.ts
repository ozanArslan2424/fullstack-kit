import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import config from "@/app.config";
import { log } from "@/lib/log";
import { db } from "@/server/db";

migrate(db, { migrationsFolder: config.server.db.out });
log.success("migrate.ts ran successfully");
