import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { db } from "@/drizzle/db";
import { JobListingApplicationTable } from "@/drizzle/schema";

import {
  getJobListingApplicaitonIdTag,
  revalidateJobListingApplicationCache,
} from "./cache/jobListingApplications";

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

export async function insertJobListingApplication(
  jobListingApplication: typeof JobListingApplicationTable.$inferInsert,
) {
  await db.insert(JobListingApplicationTable).values(jobListingApplication);
  revalidateJobListingApplicationCache(jobListingApplication);
}

export async function updateJobListingApplication(
  { userId, jobListingId }: { userId: string; jobListingId: string },
  jobListingApplication: Partial<
    typeof JobListingApplicationTable.$inferInsert
  >,
) {
  await db
    .update(JobListingApplicationTable)
    .set(jobListingApplication)
    .where(
      and(
        eq(JobListingApplicationTable.jobListingId, jobListingId),
        eq(JobListingApplicationTable.userId, userId),
      ),
    );
  revalidateJobListingApplicationCache({ jobListingId, userId });
}
