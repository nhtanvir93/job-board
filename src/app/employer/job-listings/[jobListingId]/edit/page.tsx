import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import JobListingForm from "@/features/jobListings/components/JobListingForm";
import { findJobListing } from "@/features/jobListings/db/jobListings";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";

interface Props {
  params: Promise<{ jobListingId: string }>;
}

const EditJobListingPage = (props: Props) => {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">New Job Listing</h1>
      <p className="text-muted-foreground mb-6">
        This does not post the listing yet. It just saves a draft.
      </p>
      <Card>
        <CardContent>
          <EditJobListingPageSuspense {...props} />
        </CardContent>
      </Card>
    </div>
  );
};

const EditJobListingPageSuspense = async ({ params }: Props) => {
  const organization = await getCurrentOrganization();
  if (!organization) return null;

  const { jobListingId } = await params;
  const jobListing = await findJobListing(jobListingId, organization.id);
  if (!jobListing) return notFound();

  return <JobListingForm jobListing={jobListing} />;
};

export default EditJobListingPage;
