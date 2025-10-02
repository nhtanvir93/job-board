import { auth } from "@clerk/nextjs/server";

import { findOrganizationById } from "@/features/organizations/db/organizations";
import { findUserById } from "@/features/users/db/users";

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  return findUserById(userId);
}

export async function getCurrentOrganization() {
  const { orgId } = await auth();
  if (!orgId) return null;

  return findOrganizationById(orgId);
}
