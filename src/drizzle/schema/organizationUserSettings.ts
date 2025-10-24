import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";

import { createdAt, updatedAt } from "../schemaHelper";
import { OrganizationTable } from "./organization";
import { UserTable } from "./user";

export const OrganizationUserSettingsTable = pgTable(
  "organization_user_settings",
  {
    aiPrompt: varchar(),
    createdAt,
    minimumRating: integer(),
    newApplicationEmailNotifications: boolean().notNull().default(false),
    organizationId: varchar()
      .references(() => OrganizationTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    updatedAt,
    userId: varchar()
      .references(() => UserTable.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.organizationId] })],
);

export const organizationUserSettingRelations = relations(
  OrganizationUserSettingsTable,
  ({ one }) => ({
    organization: one(OrganizationTable, {
      fields: [OrganizationUserSettingsTable.organizationId],
      references: [OrganizationTable.id],
    }),
    user: one(UserTable, {
      fields: [OrganizationUserSettingsTable.userId],
      references: [UserTable.id],
    }),
  }),
);
