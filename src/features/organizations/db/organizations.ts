import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { db } from "@/drizzle/db";
import { OrganizationTable } from "@/drizzle/schema";

import {
  getOrganizationIdTag,
  revalidateOrganizationCache,
} from "./cache/organizations";

export async function insertOrganization(
  user: typeof OrganizationTable.$inferInsert,
) {
  await db.insert(OrganizationTable).values(user).onConflictDoNothing();
}

export async function updateOrganization(
  id: string,
  user: Partial<typeof OrganizationTable.$inferInsert>,
) {
  await db
    .update(OrganizationTable)
    .set(user)
    .where(eq(OrganizationTable.id, id));
  revalidateOrganizationCache(id);
}

export async function deleteOrganization(id: string) {
  await db.delete(OrganizationTable).where(eq(OrganizationTable.id, id));
  revalidateOrganizationCache(id);
}

export async function findOrganizationById(id: string) {
  "use cache";
  cacheTag(getOrganizationIdTag(id));

  return db.query.OrganizationTable.findFirst({
    where: eq(OrganizationTable.id, id),
  });
}
