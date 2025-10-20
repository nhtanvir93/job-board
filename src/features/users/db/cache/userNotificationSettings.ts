import { revalidateTag } from "next/cache";

import { getGlobalTag, getIdTag } from "@/lib/dataCache";

export function getUserNotificationSettingGlobalTag() {
  return getGlobalTag("users");
}

export function getUserNotificationSettingIdTag(id: string) {
  return getIdTag("userNotificationSettings", id);
}

export function revalidateUserNotificationSettingCache(id: string) {
  revalidateTag(getUserNotificationSettingGlobalTag());
  revalidateTag(getUserNotificationSettingIdTag(id));
}
