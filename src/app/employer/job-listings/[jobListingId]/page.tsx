import { EditIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AsyncIf } from "@/components/AsyncIf";
import { MarkdownPartial } from "@/components/markdown/MarkdownPartial";
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import JobListingBadges from "@/features/jobListings/components/JobListingBadges";
import { findJobListing } from "@/features/jobListings/db/jobListings";
import { formatJobListingStatus } from "@/features/jobListings/lib/formatters";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUserPermissions";

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
      <div className="flex items-center gap-2 empty:-mt-4">
        <AsyncIf
          condition={() => hasOrgUserPermission("org:job_listings:update")}
        >
          <Button asChild variant="outline">
            <Link href={`/employer/job-listings/${jobListing.id}/edit`}>
              <EditIcon className="size-4" />
              Edit
            </Link>
          </Button>
        </AsyncIf>
      </div>
      <MarkdownPartial
        dialogMarkdown={
          <MarkdownRenderer
            className="prose-sm"
            source={jobListing.description}
          />
        }
        mainMarkdown={
          <MarkdownRenderer
            className="prose-sm"
            source={jobListing.description}
          />
        }
        dialogTitle="Description"
      />
    </div>
  );
};

export default JobListingPage;
