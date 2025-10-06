import { revalidateTag } from "next/cache";

import { getGlobalTag, getIdTag, getJobListingIdTag } from "@/lib/dataCache";

export function getJobListingApplicationGlobalTag() {
  return getGlobalTag("jobListingApplications");
}

export function getJobListingApplicationJobListingTag(jobListingId: string) {
  return getJobListingIdTag("jobListingApplications", jobListingId);
}

export function getJobListingApplicaitonIdTag({
  jobListingId,
  userId,
}: {
  jobListingId: string;
  userId: string;
}) {
  return getIdTag("jobListingApplications", `${jobListingId}-${userId}`);
}

export function revalidateJobListingApplicationCache(id: {
  userId: string;
  jobListingId: string;
}) {
  revalidateTag(getJobListingApplicationGlobalTag());
  revalidateTag(getJobListingApplicationJobListingTag(id.jobListingId));
  revalidateTag(getJobListingApplicaitonIdTag(id));
}
