import { relations } from "drizzle-orm";
import { boolean, pgTable, varchar } from "drizzle-orm/pg-core";

import { createdAt, updatedAt } from "../schemaHelper";
import { UserTable } from "./user";

export const UserNotificationSettingsTable = pgTable(
  "user_notification_settings",
  {
    aiPrompt: varchar(),
    createdAt,
    newJobEmailNotifications: boolean().notNull().default(false),
    updatedAt,
    userId: varchar()
      .primaryKey()
      .references(() => UserTable.id),
  },
);

export const userNotificationSettingsTableRelations = relations(
  UserNotificationSettingsTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [UserNotificationSettingsTable.userId],
      references: [UserTable.id],
    }),
  }),
);
