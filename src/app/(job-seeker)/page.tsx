import JobListingItems from "./_shared/JobListingItems";

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
