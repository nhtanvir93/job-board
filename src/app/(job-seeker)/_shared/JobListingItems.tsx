import { differenceInDays } from "date-fns";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import z from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  experienceLevels,
  JobListingTable,
  jobListingTypes,
  locationRequirements,
  OrganizationTable,
} from "@/drizzle/schema";
import JobListingBadges from "@/features/jobListings/components/JobListingBadges";
import { getJobListingsWithFilter } from "@/features/jobListings/db/jobListings";
import { convertSearchParamsToString } from "@/lib/convertSearchParamsToString";
import { cn } from "@/lib/utils";

interface Props {
  searchParams: Promise<Record<string, string | string[]>>;
  params?: Promise<{ jobListingId: string }>;
}

export const jobListingSearchParamsSchema = z.object({
  city: z.string().optional().catch(undefined),
  experience: z.enum(experienceLevels).optional().catch(undefined),
  jobIds: z
    .union([z.string(), z.array(z.string())])
    .transform((value) => (Array.isArray(value) ? value : [value]))
    .optional()
    .catch([]),
  jobType: z.enum(jobListingTypes).optional().catch(undefined),
  location: z.enum(locationRequirements).optional().catch(undefined),
  state: z.string().optional().catch(undefined),
  title: z.string().optional().catch(undefined),
});

const JobListingItems = (props: Props) => {
  return (
    <Suspense>
      <JobListingItemsSuspense {...props} />
    </Suspense>
  );
};

const JobListingItemsSuspense = async ({ searchParams, params }: Props) => {
  const jobListingId = params ? (await params).jobListingId : undefined;

  const { success, data } = jobListingSearchParamsSchema.safeParse(
    await searchParams,
  );
  const search = success ? data : {};

  const jobListings = await getJobListingsWithFilter(search, jobListingId);

  if (jobListings.length === 0) {
    return (
      <div className="text-muted-foreground p-4">No job listing found</div>
    );
  }

  return (
    <div className="space-y-4">
      {jobListings.map((jobListing) => (
        <Link
          className="block"
          key={jobListing.id}
          href={`/job-listings/${jobListing.id}?${convertSearchParamsToString(search)}`}
        >
          <JobListingItem
            jobListing={jobListing}
            organization={jobListing.organization}
          />
        </Link>
      ))}
    </div>
  );
};

function JobListingItem({
  jobListing,
  organization,
}: {
  jobListing: Pick<
    typeof JobListingTable.$inferSelect,
    | "title"
    | "stateAbbreviation"
    | "city"
    | "wage"
    | "wageInterval"
    | "experienceLevel"
    | "type"
    | "postedAt"
    | "locationRequirement"
    | "isFeatured"
  >;
  organization: Pick<
    typeof OrganizationTable.$inferSelect,
    "name" | "imageUrl"
  >;
}) {
  const nameInitials = organization?.name
    .split(" ")
    .splice(0, 4)
    .map((word) => word[0])
    .join("");

  return (
    <Card
      className={cn(
        "@container",
        jobListing.isFeatured && "border-featured bg-featured/20",
      )}
    >
      <CardHeader>
        <div className="flex gap-4">
          <Avatar className="size-14 @max-sm:hidden">
            <AvatarImage
              src={organization.imageUrl ?? undefined}
              alt={organization.name}
            />
            <AvatarFallback className="uppercase bg-primary text-primary-foreground">
              {nameInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 flex-1 @min-md:flex-row @min-md:justify-center">
            <div className="flex-flex-col">
              <CardTitle className="text-xl">{jobListing.title}</CardTitle>
              <CardDescription className="text-base">
                {organization.name}
              </CardDescription>
            </div>
            {jobListing.postedAt !== null && (
              <div className="text-sm font-medium text-primary @min-md:ml-auto">
                <Suspense fallback={jobListing.postedAt.toLocaleDateString()}>
                  <DaysSincePosting postedAt={jobListing.postedAt} />
                </Suspense>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <JobListingBadges
          jobListing={jobListing}
          className={jobListing.isFeatured ? "border-primary/35" : undefined}
        />
      </CardContent>
    </Card>
  );
}

async function DaysSincePosting({ postedAt }: { postedAt: Date }) {
  await connection();
  const daysSincePosted = differenceInDays(postedAt, Date.now());

  if (daysSincePosted === 0) {
    return <Badge>New</Badge>;
  }

  return new Intl.RelativeTimeFormat(undefined, {
    numeric: "always",
    style: "narrow",
  }).format(daysSincePosted, "days");
}

export default JobListingItems;
