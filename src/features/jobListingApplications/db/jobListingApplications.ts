import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { db } from "@/drizzle/db";
import { JobListingApplicationTable } from "@/drizzle/schema";

import { getJobListingApplicaitonIdTag } from "./cache/jobListingApplications";

export async function findJobListingApplication(
  jobListingId: string,
  userId: string,
) {
  "use cache";
  cacheTag(getJobListingApplicaitonIdTag({ jobListingId, userId }));

  return db.query.JobListingApplicationTable.findFirst({
    where: and(
      eq(JobListingApplicationTable.jobListingId, jobListingId),
      eq(JobListingApplicationTable.userId, userId),
    ),
  });
}
