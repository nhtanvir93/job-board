import { relations } from "drizzle-orm";
import { pgTable, varchar } from "drizzle-orm/pg-core";

import { createdAt, updatedAt } from "../schemaHelper";
import { OrganizationUserSettingsTable } from "./organizationUserSettings";
import { UserNotificationSettingsTable } from "./userNotificationSettings";
import { UserResumeTable } from "./userResume";

export const UserTable = pgTable("users", {
    createdAt,
    email: varchar().notNull().unique(),
    id: varchar().primaryKey(),
    imageUrl: varchar().notNull(),
    name: varchar().notNull(),
    updatedAt,
});

export const userRelations = relations(UserTable, ({one, many}) => ({
    notificationSettings: one(UserNotificationSettingsTable),
    organizationUserSettings: many(OrganizationUserSettingsTable),
    resume: one(UserResumeTable),
}));
