import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";

import { getUserIdTag, revalidateUserCache } from "./cache/users";

export async function insertUser(user: typeof UserTable.$inferInsert) {
  await db.insert(UserTable).values(user).onConflictDoNothing();
}

export async function updateUser(
  id: string,
  user: Partial<typeof UserTable.$inferInsert>,
) {
  await db.update(UserTable).set(user).where(eq(UserTable.id, id));
  revalidateUserCache(id);
}

export async function deleteUser(id: string) {
  await db.delete(UserTable).where(eq(UserTable.id, id));
  revalidateUserCache(id);
}

export async function findUserById(id: string) {
  "use cache";
  cacheTag(getUserIdTag(id));

  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, id),
  });
}
