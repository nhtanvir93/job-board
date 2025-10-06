"use server";

import { redirect } from "next/navigation";
import z from "zod";

import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUserPermissions";

import {
  deleteJobListing as deleteJobListingDB,
  findJobListing,
  insertJobListing,
  updateJobListing as updateJobListingDB,
} from "../db/jobListings";
import {
  hasReachedMaxFeaturedJobListings,
  hasReachedMaxPublishedJobListings,
} from "../lib/planFeatureHelpers";
import { getNextJobListingStatus } from "../lib/utils";
import { jobListingSchema } from "./schema";

export async function createJobListing(
  unsafeData: z.infer<typeof jobListingSchema>,
) {
  const organization = await getCurrentOrganization();

  if (
    !organization ||
    !(await hasOrgUserPermission("org:job_listings:create"))
  ) {
    return {
      error: true,
      message: "You don't have permission to create a job listing",
    };
  }

  const { success, data } = jobListingSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "There was an error validating your job listing data",
    };
  }

  const newJobListing = await insertJobListing({
    ...data,
    organizationId: organization.id,
    status: "draft",
  });

  redirect(`/employer/job-listings/${newJobListing.id}`);
}

export async function updateJobListing(
  id: string,
  unsafeData: z.infer<typeof jobListingSchema>,
) {
  const organization = await getCurrentOrganization();

  if (
    !organization ||
    !(await hasOrgUserPermission("org:job_listings:update"))
  ) {
    return {
      error: true,
      message: "You don't have permission to update this job listing",
    };
  }

  const { success, data } = jobListingSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "There was an error validating your job listing data",
    };
  }

  const jobListing = await findJobListing(id, organization.id);

  if (!jobListing) {
    return {
      error: true,
      message: "No job listing found for update",
    };
  }

  const updatedJobListing = await updateJobListingDB(id, data);

  redirect(`/employer/job-listings/${updatedJobListing.id}`);
}

export async function toggleJobListingStatus(id: string) {
  const error = {
    error: true,
    message: "You don't have permission to update this job listing's status",
  };
  const organization = await getCurrentOrganization();

  if (
    !organization ||
    !(await hasOrgUserPermission("org:job_listings:update"))
  ) {
    return error;
  }

  const jobListing = await findJobListing(id, organization.id);

  if (!jobListing) {
    return {
      error: true,
      message: "No job listing found for update status",
    };
  }

  const newStatus = getNextJobListingStatus(jobListing.status);
  if (
    !(await hasOrgUserPermission("org:job_listings:change_status")) ||
    (newStatus === "published" && (await hasReachedMaxPublishedJobListings()))
  ) {
    return error;
  }

  await updateJobListingDB(id, {
    isFeatured: newStatus === "published" ? undefined : false,
    postedAt:
      newStatus === "published" && jobListing.postedAt === null
        ? new Date()
        : undefined,
    status: newStatus,
  });

  return { error: false };
}

export async function toggleJobListingFeatured(id: string) {
  const error = {
    error: true,
    message:
      "You don't have permission to update this job listing's featured status",
  };
  const organization = await getCurrentOrganization();

  if (
    !organization ||
    !(await hasOrgUserPermission("org:job_listings:update"))
  ) {
    return error;
  }

  const jobListing = await findJobListing(id, organization.id);

  if (!jobListing) {
    return {
      error: true,
      message: "No job listing found for update featured status",
    };
  }

  const newFeaturedStatus = !jobListing.isFeatured;
  if (
    !(await hasOrgUserPermission("org:job_listings:change_status")) ||
    (newFeaturedStatus === true && (await hasReachedMaxFeaturedJobListings()))
  ) {
    return error;
  }

  await updateJobListingDB(id, {
    isFeatured: newFeaturedStatus,
  });

  return { error: false };
}

export async function deleteJobListing(id: string) {
  const error = {
    error: true,
    message: "You don't have permission to delete this job listing",
  };

  const organization = await getCurrentOrganization();
  if (!organization || !(await hasOrgUserPermission("org:job_listings:delete")))
    return error;

  const jobListing = await findJobListing(id, organization.id);
  if (!jobListing) {
    return {
      error: true,
      message: "No job listing found for delete",
    };
  }

  await deleteJobListingDB(id);

  redirect("/employer");
}
