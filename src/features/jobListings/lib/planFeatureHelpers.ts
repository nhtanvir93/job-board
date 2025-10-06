import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { hasPlanFeature } from "@/services/clerk/lib/planFeatures";

import { getPublishedJobListingCount } from "../db/jobListings";

export async function hasReachedMaxFeaturedJobListings() {
  const organization = await getCurrentOrganization();

  if (!organization) return true;

  const totalPublished = await getPublishedJobListingCount(organization.id);

  const canPost = await Promise.all([
    hasPlanFeature("post_1_job_listing").then(
      (has) => has && totalPublished < 1,
    ),
    hasPlanFeature("post_3_job_listings").then(
      (has) => has && totalPublished < 3,
    ),
    hasPlanFeature("post_15_job_listings").then(
      (has) => has && totalPublished < 15,
    ),
  ]);

  return !canPost.some(Boolean);
}
