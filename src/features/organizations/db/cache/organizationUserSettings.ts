import { revalidateTag } from "next/cache";

import { getGlobalTag, getIdTag } from "@/lib/dataCache";

export function getOrganizationUserSettingsGlobalTag() {
  return getGlobalTag("organizationUserSettings");
}

export function getOrganizationUserSettingsIdTag({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) {
  return getIdTag("organizationUserSettings", `${organizationId}-${userId}`);
}

export function revalidateOrganizationUserSettingsCache(id: {
  userId: string;
  organizationId: string;
}) {
  revalidateTag(getOrganizationUserSettingsGlobalTag());
  revalidateTag(getOrganizationUserSettingsIdTag(id));
}
