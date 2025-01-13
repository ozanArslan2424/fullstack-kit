import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { boolean, enumLite, timestamp } from "./utils";

export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	image: text("image"),
	about: text("about"),
	emailVerified: boolean("emailVerified").notNull(),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
});

export const session = sqliteTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expiresAt").notNull(),
	userId: text("userId")
		.notNull()
		.references(() => user.id),
});

export const account = sqliteTable("account", {
	id: text("id").primaryKey(),
	providerId: enumLite("providerId", ["google", "github", "email"]).notNull(),
	userId: text("userId")
		.notNull()
		.references(() => user.id),
	passwordHash: text("passwordHash").notNull(),
	locked: integer("locked", { mode: "boolean" }),
});

export const verification = sqliteTable("verification", {
	id: text("id").primaryKey(),
	userEmail: text("userEmail").notNull(),
	userId: text("userId").notNull(),
	token: text("token").notNull(),
	type: text("type", { enum: ["email", "password"] }).notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
	createdAt: timestamp("createdAt"),
});
