import { revalidateTag } from "next/cache";

import { getGlobalTag, getIdTag, getOrganizationTag } from "@/lib/dataCache";

export function getJobListingGlobalTag() {
  return getGlobalTag("jobListings");
}

export function getJobListingIdTag(id: string) {
  return getIdTag("jobListings", id);
}

export function getJobListingOrganizationTag(organizationId: string) {
  return getOrganizationTag("jobListings", organizationId);
}

export function revalidateJobListingCache(id: string) {
  revalidateTag(getJobListingGlobalTag());
  revalidateTag(getJobListingIdTag(id));
}
