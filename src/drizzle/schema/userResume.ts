import { relations } from "drizzle-orm";
import { pgTable, varchar } from "drizzle-orm/pg-core";

import { createdAt, updatedAt } from "../schemaHelper";
import { UserTable } from "./user";

export const UserResumeTable = pgTable("user_resumes", {
  aiSummary: varchar(),
  createdAt,
  resumeFileKey: varchar().notNull(),
  resumeFileUrl: varchar().notNull(),
  updatedAt,
  userId: varchar()
    .primaryKey()
    .references(() => UserTable.id),
});

export const userResumeRelations = relations(UserResumeTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [UserResumeTable.userId],
    references: [UserTable.id],
  }),
}));
