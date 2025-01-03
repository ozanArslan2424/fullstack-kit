import type { table } from ".";

export type UserSelect = typeof table.user.$inferSelect;
export type UserInsert = typeof table.user.$inferInsert;

export type SessionSelect = typeof table.session.$inferSelect;
export type SessionInsert = typeof table.session.$inferInsert;

export type AccountSelect = typeof table.account.$inferSelect;
export type AccountInsert = typeof table.account.$inferInsert;

export type VerificationSelect = typeof table.verification.$inferSelect;
export type VerificationInsert = typeof table.verification.$inferInsert;
