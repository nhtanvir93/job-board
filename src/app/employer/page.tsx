import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getMostRecentJobListingId } from "@/features/jobListings/db/jobListings";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";

export const metadata: Metadata = {
  description:
    "Employer can create, update, delete and change status like DRAFT, PUBLISHED, DELISTED, FEATURED.",
  title: "Employer Dashboard | Job Board",
};

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
