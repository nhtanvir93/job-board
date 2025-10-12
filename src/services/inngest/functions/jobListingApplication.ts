import { and, eq } from "drizzle-orm";

import { db } from "@/drizzle/db";
import {
  JobListingApplicationTable,
  JobListingTable,
  UserResumeTable,
} from "@/drizzle/schema";

import { applicantRankingAgent } from "../ai/applicantRankingAgent";
import { inngest } from "../client";

export const rankApplication = inngest.createFunction(
  {
    id: "rank-applicant",
    name: "Rank Applicant",
  },
  {
    event: "app/jobListingApplication:created",
  },
  async ({ step, event }) => {
    const { userId, jobListingId } = event.data;

    const getCoverLetter = step.run("get-cover-letter", async () => {
      const application = await db.query.JobListingApplicationTable.findFirst({
        columns: {
          coverLetter: true,
        },
        where: and(
          eq(JobListingApplicationTable.userId, userId),
          eq(JobListingApplicationTable.jobListingId, jobListingId),
        ),
      });

      return application?.coverLetter;
    });

    const getResumeAISummary = step.run("get-resume", async () => {
      const resume = await db.query.UserResumeTable.findFirst({
        columns: {
          aiSummary: true,
        },
        where: eq(UserResumeTable.userId, userId),
      });

      return resume?.aiSummary;
    });

    const getJobListing = step.run("get-job-listing", async () => {
      return await db.query.JobListingTable.findFirst({
        columns: {
          city: true,
          description: true,
          experienceLevel: true,
          id: true,
          locationRequirement: true,
          stateAbbreviation: true,
          title: true,
          type: true,
          wage: true,
          wageInterval: true,
        },
        where: eq(JobListingTable.id, jobListingId),
      });
    });

    const [coverLetter, resumeSummary, jobListing] = await Promise.all([
      getCoverLetter,
      getResumeAISummary,
      getJobListing,
    ]);

    if (!resumeSummary || !jobListing) return;

    await applicantRankingAgent.run(
      JSON.stringify({
        coverLetter,
        jobListing,
        jobListingId,
        resumeSummary,
        userId,
      }),
    );
  },
);
