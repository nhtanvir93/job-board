import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import JobListingBadges from "@/features/jobListings/components/JobListingBadges";
import { findJobListing } from "@/features/jobListings/db/jobListings";
import { formatJobListingStatus } from "@/features/jobListings/lib/formatters";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";

interface Props {
  params: Promise<{ jobListingId: string }>;
}

const JobListingPage = (props: Props) => {
  return (
    <Suspense>
      <JobListingPageSuspense {...props} />
    </Suspense>
  );
};

const JobListingPageSuspense = async ({ params }: Props) => {
  const organization = await getCurrentOrganization();
  if (!organization) return null;

  const { jobListingId } = await params;
  const jobListing = await findJobListing(jobListingId, organization.id);
  if (!jobListing) return notFound();

  return (
    <div className="space-y-6 max-w-6xl max-auto p-4 @container @max-4xl:flex-col @max-4xl:items-start">
      <h1 className="text-2xl font-bold tracking-tight">{jobListing.title}</h1>
      <div className="flex flex-wrap gap-2 mt-2">
        <Badge>{formatJobListingStatus(jobListing.status)}</Badge>
        <JobListingBadges jobListing={jobListing} />
      </div>
    </div>
  );
};

export default JobListingPage;
