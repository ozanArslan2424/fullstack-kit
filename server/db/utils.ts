import { integer, text } from "drizzle-orm/sqlite-core";

type EnumValues = [string, ...string[]];

// * Data types for sqlite drizzle-orm
export const timestamp = (name: string) => integer(name, { mode: "timestamp" });
export const number = (name: string) => integer(name, { mode: "number" });
export const boolean = (name: string) => integer(name, { mode: "boolean" });
export const enumLite = (name: string, values: EnumValues) => text(name, { enum: values });
export const json = (name: string) => text(name, { mode: "json" });

export * from "drizzle-orm/sqlite-core";
