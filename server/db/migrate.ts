import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { log } from "@/lib/log";
import { db } from "@/server/db";

migrate(db, { migrationsFolder: "drizzle" });
log.success("migrate.ts ran successfully");
