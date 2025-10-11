import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { db } from "@/drizzle/db";
import { UserResumeTable } from "@/drizzle/schema";

import {
  getUserResumeIdTag,
  revalidateUserResumeCache,
} from "./cache/userResumes";

export async function deleteUserResume(userId: string) {
  await db.delete(UserResumeTable).where(eq(UserResumeTable.userId, userId));
  revalidateUserResumeCache(userId);
}

export async function findUserResumeByUserId(userId: string) {
  "use cache";
  cacheTag(getUserResumeIdTag(userId));

  console.log("findUserResumeByUserId");

  return db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.userId, userId),
  });
}

export async function upsertUserResume(
  userId: string,
  userResume: Omit<typeof UserResumeTable.$inferInsert, "userId">,
) {
  await db
    .insert(UserResumeTable)
    .values({ userId, ...userResume })
    .onConflictDoUpdate({
      set: userResume,
      target: UserResumeTable.userId,
    });

  revalidateUserResumeCache(userId);
}

export async function getUserResumeFileKey(userId: string) {
  const data = await db.query.UserResumeTable.findFirst({
    columns: {
      resumeFileKey: true,
    },
    where: eq(UserResumeTable.userId, userId),
  });

  return data?.resumeFileKey;
}
