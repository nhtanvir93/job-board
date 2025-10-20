"use server";

import z from "zod";

import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";

import { updateUserNotificationSettings as updateUserNotificationSettingsDb } from "./../db/userNotificationSettings";
import { userNotificationSettingsSchema } from "./schema";

export async function updateUserNotificationSettings(
  unsafeData: z.infer<typeof userNotificationSettingsSchema>,
) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      error: true,
      message: "You must be signed in to update notification settings",
    };
  }

  const { success, data } =
    userNotificationSettingsSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "There was an error validating you notification settings data",
    };
  }

  await updateUserNotificationSettingsDb(user.id, data);

  return {
    error: false,
    message: "Successfully updated your notification settings",
  };
}
