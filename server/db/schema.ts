import { boolean, enumLite, sqliteTable, text, timestamp } from "@/server/db/utils";

export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	image: text("image"),
	about: text("about"),
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
	emailVerified: boolean("emailVerified"),
	locked: boolean("locked"),
});

export const verification = sqliteTable("verification", {
	id: text("id").primaryKey(),
	userEmail: text("userEmail").notNull(),
	userId: text("userId").notNull(),
	token: text("token").notNull(),
	type: enumLite("type", ["email", "password"]).notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
	createdAt: timestamp("createdAt"),
});
