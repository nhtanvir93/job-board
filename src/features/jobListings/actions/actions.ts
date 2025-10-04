"use server";

import { redirect } from "next/navigation";
import z from "zod";

import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";

import {
  insertJobListing,
  updateJobListing as updateJobListingDB,
} from "../db/jobListings";
import { jobListingSchema } from "./schema";

export async function createJobListing(
  unsafeData: z.infer<typeof jobListingSchema>,
) {
  const organization = await getCurrentOrganization();

  if (!organization) {
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

  if (!organization) {
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

  const updatedJobListing = await updateJobListingDB(id, data);

  redirect(`/employer/job-listings/${updatedJobListing.id}`);
}
