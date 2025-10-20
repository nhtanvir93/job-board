import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { db } from "@/drizzle/db";
import { UserNotificationSettingsTable } from "@/drizzle/schema";

import {
  getUserNotificationSettingIdTag,
  revalidateUserNotificationSettingCache,
} from "./cache/userNotificationSettings";

export async function insertUserNotificationSettings(
  userNotificationSettings: typeof UserNotificationSettingsTable.$inferInsert,
) {
  await db
    .insert(UserNotificationSettingsTable)
    .values(userNotificationSettings)
    .onConflictDoNothing();
}

export async function getNotificationSettings(userId: string) {
  "use cache";
  cacheTag(getUserNotificationSettingIdTag(userId));

  return db.query.UserNotificationSettingsTable.findFirst({
    where: eq(UserNotificationSettingsTable.userId, userId),
  });
}

export async function updateUserNotificationSettings(
  userId: string,
  settings: Partial<
    Omit<typeof UserNotificationSettingsTable.$inferInsert, "userId">
  >,
) {
  await db
    .insert(UserNotificationSettingsTable)
    .values({ ...settings, userId })
    .onConflictDoUpdate({
      set: settings,
      target: UserNotificationSettingsTable.userId,
    });

  revalidateUserNotificationSettingCache(userId);
}
