import { and, eq } from "drizzle-orm";

import { db } from "@/drizzle/db";
import { OrganizationUserSettingsTable } from "@/drizzle/schema";

import { revalidateOrganizationUserSettingsCache } from "./cache/organizationUserSettings";

export async function insertOrganizationUserSettings(
  settings: typeof OrganizationUserSettingsTable.$inferInsert,
) {
  await db
    .insert(OrganizationUserSettingsTable)
    .values(settings)
    .onConflictDoNothing();

  revalidateOrganizationUserSettingsCache(settings);
}

export async function deleteOrganizationUserSettings({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) {
  await db
    .delete(OrganizationUserSettingsTable)
    .where(
      and(
        eq(OrganizationUserSettingsTable.userId, userId),
        eq(OrganizationUserSettingsTable.organizationId, organizationId),
      ),
    );

  revalidateOrganizationUserSettingsCache({
    organizationId,
    userId,
  });
}
