import { auth } from "@clerk/nextjs/server";

import { findUserById } from "@/features/users/db/users";

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  return findUserById(userId);
}
