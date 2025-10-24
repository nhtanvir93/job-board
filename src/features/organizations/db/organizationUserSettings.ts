import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { db } from "@/drizzle/db";
import { OrganizationUserSettingsTable } from "@/drizzle/schema";

import {
  getOrganizationUserSettingsIdTag,
  revalidateOrganizationUserSettingsCache,
} from "./cache/organizationUserSettings";

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

export async function getOrganizationUserSettings({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) {
  "use cache";

  cacheTag(
    getOrganizationUserSettingsIdTag({
      organizationId,
      userId,
    }),
  );

  return db.query.OrganizationUserSettingsTable.findFirst({
    columns: {
      minimumRating: true,
      newApplicationEmailNotifications: true,
    },
    where: and(
      eq(OrganizationUserSettingsTable.userId, userId),
      eq(OrganizationUserSettingsTable.organizationId, organizationId),
    ),
  });
}

export async function updateOrganizationUserSettings(
  {
    userId,
    organizationId,
  }: {
    userId: string;
    organizationId: string;
  },
  settings: Partial<
    Omit<
      typeof OrganizationUserSettingsTable.$inferInsert,
      "userId" | "organizationId"
    >
  >,
) {
  await db
    .insert(OrganizationUserSettingsTable)
    .values({ ...settings, organizationId, userId })
    .onConflictDoUpdate({
      set: settings,
      target: [
        OrganizationUserSettingsTable.userId,
        OrganizationUserSettingsTable.organizationId,
      ],
    });

  revalidateOrganizationUserSettingsCache({
    organizationId,
    userId,
  });
}
