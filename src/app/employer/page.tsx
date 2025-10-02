import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getMostRecentJobListingId } from "@/features/organizations/jobListings/db/jobListings";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";

const EmployerHomePage = () => {
  return (
    <Suspense>
      <EmployerHomePageSuspense />
    </Suspense>
  );
};

const EmployerHomePageSuspense = async () => {
  const organization = await getCurrentOrganization();
  if (!organization) return null;

  const jobListing = await getMostRecentJobListingId(organization.id);

  if (!jobListing) return redirect("/employer/job-listings/new");
  else return redirect(`/employer/job-listings/${jobListing.id}`);
};

export default EmployerHomePage;
