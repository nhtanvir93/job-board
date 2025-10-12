"use server";

import { revalidateUserResumeCache } from "../db/cache/userResumes";

export async function revalidateUserResume(userId: string) {
  revalidateUserResumeCache(userId);
}
