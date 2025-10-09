import { Metadata } from "next";

import JobListingItems from "./_shared/JobListingItems";

export const metadata: Metadata = {
  description: "Anyone can view all published job circulars.",
  title: "Published Job Circulars | Job Board",
};

const JobSeekerHomePage = ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) => {
  return (
    <div className="m-4">
      <JobListingItems searchParams={searchParams} />
    </div>
  );
};

export default JobSeekerHomePage;
