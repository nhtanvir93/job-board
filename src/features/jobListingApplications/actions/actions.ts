"use server";

import z from "zod";

import { newJobListingApplicationSchema } from "@/features/jobListings/actions/schema";
import { findPublicJobListing } from "@/features/jobListings/db/jobListings";
import { findUserResumeByUserId } from "@/features/users/db/userResumes";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { inngest } from "@/services/inngest/client";

import { insertJobListingApplication } from "../db/jobListingApplications";

export async function createJobListingApplication(
  jobListingId: string,
  unsafeData: z.infer<typeof newJobListingApplicationSchema>,
) {
  const permissionError = {
    error: true,
    message: "You don't have permission to submit an application",
  };

  const user = await getCurrentUser();
  if (!user) return permissionError;

  const [userResume, jobListing] = await Promise.all([
    findUserResumeByUserId(user.id),
    findPublicJobListing(jobListingId),
  ]);

  if (!userResume || !jobListing) return permissionError;

  const { success, data } =
    newJobListingApplicationSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "There was an error validating your application data",
    };
  }

  await inngest.send({
    data: { jobListingId, userId: user.id },
    name: "app/jobListingApplication:created",
  });

  await insertJobListingApplication({
    jobListingId,
    userId: user.id,
    ...data,
  });

  return {
    error: false,
    message: "Your application was submitted successfully",
  };
}
