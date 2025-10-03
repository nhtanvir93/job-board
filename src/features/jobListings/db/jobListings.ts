import { desc, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";

import { getJobListingOrganizationTag } from "./cache/jobListings";

export async function getMostRecentJobListingId(organizationId: string) {
  "use cache";
  cacheTag(getJobListingOrganizationTag(organizationId));

  return db.query.JobListingTable.findFirst({
    columns: { id: true },
    orderBy: desc(JobListingTable.createdAt),
    where: eq(JobListingTable.organizationId, organizationId),
  });
}
