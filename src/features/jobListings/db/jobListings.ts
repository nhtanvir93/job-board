import { and, desc, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";

import {
  getJobListingIdTag,
  getJobListingOrganizationTag,
  revalidateJobListingCache,
} from "./cache/jobListings";

export async function getMostRecentJobListingId(organizationId: string) {
  "use cache";
  cacheTag(getJobListingOrganizationTag(organizationId));

  return db.query.JobListingTable.findFirst({
    columns: { id: true },
    orderBy: desc(JobListingTable.createdAt),
    where: eq(JobListingTable.organizationId, organizationId),
  });
}

export async function insertJobListing(
  jobListing: typeof JobListingTable.$inferInsert,
) {
  const [newJobListing] = await db
    .insert(JobListingTable)
    .values(jobListing)
    .returning({
      id: JobListingTable.id,
      organizationId: JobListingTable.organizationId,
    });

  revalidateJobListingCache(newJobListing.id, newJobListing.organizationId);

  return newJobListing;
}

export async function findJobListing(id: string, organizationId: string) {
  "use cache";
  cacheTag(getJobListingIdTag(id));

  return db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.organizationId, organizationId),
    ),
  });
}
