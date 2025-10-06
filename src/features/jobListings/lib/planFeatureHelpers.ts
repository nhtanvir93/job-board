import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { hasPlanFeature } from "@/services/clerk/lib/planFeatures";

import {
  getFeaturedJobListingCount,
  getPublishedJobListingCount,
} from "../db/jobListings";

export async function hasReachedMaxPublishedJobListings() {
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

export async function hasReachedMaxFeaturedJobListings() {
  const organization = await getCurrentOrganization();

  if (!organization) return true;

  const totalFeatured = await getFeaturedJobListingCount(organization.id);

  const canPost = await Promise.all([
    hasPlanFeature("1_featured_job_listing").then(
      (has) => has && totalFeatured < 1,
    ),
    hasPlanFeature("unlimited_featured_job_listings"),
  ]);

  return !canPost.some(Boolean);
}
