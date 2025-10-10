import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { db } from "@/drizzle/db";
import { UserResumeTable } from "@/drizzle/schema";

import {
  getUserResumeIdTag,
  revalidateUserResumeCache,
} from "./cache/userResumes";

export async function insertUserResume(
  userResume: typeof UserResumeTable.$inferInsert,
) {
  await db.insert(UserResumeTable).values(userResume).onConflictDoNothing();
}

export async function updateUserResume(
  userId: string,
  userResume: Partial<typeof UserResumeTable.$inferInsert>,
) {
  await db
    .update(UserResumeTable)
    .set(userResume)
    .where(eq(UserResumeTable.userId, userId));
  revalidateUserResumeCache(userId);
}

export async function deleteUserResume(userId: string) {
  await db.delete(UserResumeTable).where(eq(UserResumeTable.userId, userId));
  revalidateUserResumeCache(userId);
}

export async function findUserResumeByUserId(userId: string) {
  "use cache";
  cacheTag(getUserResumeIdTag(userId));

  return db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.userId, userId),
  });
}
