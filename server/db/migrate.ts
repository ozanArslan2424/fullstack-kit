import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from "@/server/db";
import { log } from "@/server/utils";

migrate(db, { migrationsFolder: "drizzle" });
log.success("migrate.ts ran successfully");
