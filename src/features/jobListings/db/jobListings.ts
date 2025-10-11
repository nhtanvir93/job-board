import { and, count, desc, eq, ilike, or, SQL } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import z from "zod";

import { jobListingSearchParamsSchema } from "@/app/(job-seeker)/_shared/JobListingItems";
import { db } from "@/drizzle/db";
import { JobListingApplicationTable, JobListingTable } from "@/drizzle/schema";
import { getJobListingApplicationJobListingTag } from "@/features/jobListingApplications/db/cache/jobListingApplications";
import { getOrganizationIdTag } from "@/features/organizations/db/cache/organizations";

import {
  getJobListingFeaturedCountOrganizationTag,
  getJobListingIdTag,
  getJobListingLatestOrganizationTag,
  getJobListingOrganizationTag,
  getJobListingPublishedCountOrganizationTag,
  revalidateJobListingCache,
} from "./cache/jobListings";

export async function getMostRecentJobListingId(organizationId: string) {
  "use cache";
  cacheTag(getJobListingLatestOrganizationTag(organizationId));

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

export async function updateJobListing(
  id: string,
  jobListing: Partial<typeof JobListingTable.$inferInsert>,
) {
  const [updatedJobListing] = await db
    .update(JobListingTable)
    .set(jobListing)
    .where(eq(JobListingTable.id, id))
    .returning({
      id: JobListingTable.id,
      organizationId: JobListingTable.organizationId,
    });
  revalidateJobListingCache(
    updatedJobListing.id,
    updatedJobListing.organizationId,
  );

  return updatedJobListing;
}

export async function findPublicJobListing(id: string) {
  "use cache";
  cacheTag(getJobListingIdTag(id));

  return await db.query.JobListingTable.findFirst({
    columns: {
      id: true,
    },
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.status, "published"),
    ),
  });
}

export async function findJobListingById(id: string) {
  "use cache";
  cacheTag(getJobListingIdTag(id));

  const data = await db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.status, "published"),
    ),
    with: {
      organization: {
        columns: {
          id: true,
          imageUrl: true,
          name: true,
        },
      },
    },
  });

  if (data) {
    cacheTag(getOrganizationIdTag(data.organization.id));
  }

  return data;
}

export async function findJobListing(id: string, organizationId: string) {
  "use cache";
  cacheTag(getJobListingIdTag(id)); console.log("New Job Listing");

  return db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.organizationId, organizationId),
    ),
    with: {
      organization: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function getPublishedJobListingCount(organizationId: string) {
  "use cache";
  cacheTag(getJobListingPublishedCountOrganizationTag(organizationId));

  const [result] = await db
    .select({ count: count() })
    .from(JobListingTable)
    .where(
      and(
        eq(JobListingTable.organizationId, organizationId),
        eq(JobListingTable.status, "published"),
      ),
    );

  return result?.count ?? 0;
}

export async function getFeaturedJobListingCount(organizationId: string) {
  "use cache";
  cacheTag(getJobListingFeaturedCountOrganizationTag(organizationId));

  const [result] = await db
    .select({ count: count() })
    .from(JobListingTable)
    .where(
      and(
        eq(JobListingTable.organizationId, organizationId),
        eq(JobListingTable.isFeatured, true),
      ),
    );

  return result?.count ?? 0;
}

export async function deleteJobListing(id: string) {
  const [deletedJobListing] = await db
    .delete(JobListingTable)
    .where(eq(JobListingTable.id, id))
    .returning({
      id: JobListingTable.id,
      organizationId: JobListingTable.organizationId,
    });
  revalidateJobListingCache(
    deletedJobListing.id,
    deletedJobListing.organizationId,
  );
}

export async function getJobListings(orgId: string) {
  "use cache";
  cacheTag(getJobListingOrganizationTag(orgId));

  const data = await db
    .select({
      applicationCount: count(JobListingApplicationTable.userId),
      id: JobListingTable.id,
      status: JobListingTable.status,
      title: JobListingTable.title,
    })
    .from(JobListingTable)
    .where(eq(JobListingTable.organizationId, orgId))
    .leftJoin(
      JobListingApplicationTable,
      eq(JobListingApplicationTable.jobListingId, JobListingTable.id),
    )
    .groupBy(JobListingApplicationTable.jobListingId, JobListingTable.id)
    .orderBy(desc(JobListingTable.createdAt));

  data.forEach((jobListing) => {
    cacheTag(getJobListingApplicationJobListingTag(jobListing.id));
  });

  return data;
}

export async function getJobListingsWithFilter(
  searchParams: z.infer<typeof jobListingSearchParamsSchema>,
  jobListingId: string | undefined,
) {
  "use cache";

  const whereConditions: SQL[] = [];

  if (searchParams.title) {
    whereConditions.push(
      ilike(JobListingTable.title, `%${searchParams.title}%`),
    );
  }

  if (searchParams.location) {
    whereConditions.push(
      eq(JobListingTable.locationRequirement, searchParams.location),
    );
  }

  if (searchParams.city) {
    whereConditions.push(ilike(JobListingTable.city, `%${searchParams.city}%`));
  }

  if (searchParams.state) {
    whereConditions.push(
      ilike(JobListingTable.stateAbbreviation, `%${searchParams.state}%`),
    );
  }

  if (searchParams.experience) {
    whereConditions.push(
      eq(JobListingTable.experienceLevel, searchParams.experience),
    );
  }

  if (searchParams.jobType) {
    whereConditions.push(eq(JobListingTable.type, searchParams.jobType));
  }

  if (searchParams.jobIds) {
    whereConditions.push(
      or(...searchParams.jobIds.map((jobId) => eq(JobListingTable.id, jobId)))!,
    );
  }

  const data = await db.query.JobListingTable.findMany({
    orderBy: [desc(JobListingTable.isFeatured), desc(JobListingTable.postedAt)],
    where: or(
      jobListingId
        ? and(
            eq(JobListingTable.id, jobListingId),
            eq(JobListingTable.status, "published"),
          )
        : undefined,
      and(eq(JobListingTable.status, "published"), ...whereConditions),
    ),
    with: {
      organization: {
        columns: {
          id: true,
          imageUrl: true,
          name: true,
        },
      },
    },
  });

  data.forEach((jobListing) => {
    cacheTag(getOrganizationIdTag(jobListing.organization.id));
  });

  return data;
}
