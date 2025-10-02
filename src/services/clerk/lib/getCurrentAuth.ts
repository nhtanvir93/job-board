import { auth } from "@clerk/nextjs/server";

import { findUserById } from "@/features/users/db/users";

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  return findUserById(userId);
}

export async function getCurrentOrganization() {
  const { orgId } = await auth();
  if (!orgId) return null;

  return {
    imageUrl:
      "https://d2jhcfgvzjqsa8.cloudfront.net/storage/2022/04/download.png",
    name: "Disco IT",
  };

  // return findOrganizationById(orgId);
}
