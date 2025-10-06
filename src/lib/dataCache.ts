type CacheTag =
  | "users"
  | "organizations"
  | "jobListings"
  | "userNotificationSettings"
  | "userResumes"
  | "jobListingApplications"
  | "organizationUserSettings";

export function getGlobalTag(tag: CacheTag) {
  return `global:${tag}` as const;
}

export function getOrganizationTag(tag: CacheTag, organizationId: string) {
  return `organization:${organizationId}-${tag}` as const;
}

export function getJobListingIdTag(tag: CacheTag, jobListingId: string) {
  return `jobListing:${jobListingId}-${tag}` as const;
}

export function getLatestOrganizationTag(
  tag: CacheTag,
  organizationId: string,
) {
  return `organization:${organizationId}-${tag}:latest` as const;
}

export function getCountOrganizationTag(
  tag: CacheTag,
  organizationId: string,
  subTags?: string[],
) {
  if (!subTags) {
    return `organization:${organizationId}-${tag}:count` as const;
  }

  return `organization:${organizationId}-${tag}(${subTags.join(",")}):count` as const;
}

export function getIdTag(tag: CacheTag, id: string) {
  return `id:${id}-${tag}` as const;
}
