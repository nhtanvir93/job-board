"use server";

import z from "zod";

import { updateOrganizationUserSettings as updateOrganizationUserSettingsDb } from "@/features/organizations/db/organizationUserSettings";
import {
  getCurrentOrganization,
  getCurrentUser,
} from "@/services/clerk/lib/getCurrentAuth";

import { organizationUserSettingsSchema } from "./schemas";

export async function updateOrganizationUserSettings(
  unsafeData: z.infer<typeof organizationUserSettingsSchema>,
) {
  const user = await getCurrentUser();
  const organization = await getCurrentOrganization();

  if (!user || !organization) {
    return {
      error: true,
      message: "You must be signed in to update notification settings",
    };
  }

  const { success, data } =
    organizationUserSettingsSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "There was an error validating your notification settings",
    };
  }

  await updateOrganizationUserSettingsDb(
    {
      organizationId: organization.id,
      userId: user.id,
    },
    data,
  );

  return {
    error: false,
    message: "Successfully updated your notification settings",
  };
}
