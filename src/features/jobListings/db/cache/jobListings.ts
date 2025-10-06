import { revalidateTag } from "next/cache";

import {
  getCountOrganizationTag,
  getGlobalTag,
  getIdTag,
  getLatestOrganizationTag,
  getOrganizationTag,
} from "@/lib/dataCache";

export function getJobListingGlobalTag() {
  return getGlobalTag("jobListings");
}

export function getJobListingIdTag(id: string) {
  return getIdTag("jobListings", id);
}

export function getJobListingOrganizationTag(organizationId: string) {
  return getOrganizationTag("jobListings", organizationId);
}

export function getJobListingLatestOrganizationTag(organizationId: string) {
  return getLatestOrganizationTag("jobListings", organizationId);
}

export function getJobListingPublishedCountOrganizationTag(
  organizationId: string,
) {
  return getCountOrganizationTag("jobListings", organizationId, ["published"]);
}

export function getJobListingFeaturedCountOrganizationTag(
  organizationId: string,
) {
  return getCountOrganizationTag("jobListings", organizationId, ["featured"]);
}

export function revalidateJobListingCache(id: string, organizationId: string) {
  revalidateTag(getJobListingGlobalTag());
  revalidateTag(getJobListingIdTag(id));
  revalidateTag(getJobListingOrganizationTag(organizationId));
}
