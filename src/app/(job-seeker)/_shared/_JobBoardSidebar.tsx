import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import JobListingFilterForm from "@/features/jobListings/components/JobListingFilterForm";

const JobBoardSidebar = () => {
  return (
    <SidebarGroup className="group-data-[state=collapsed]:hidden">
      <SidebarGroupContent className="px-1">
        <JobListingFilterForm />
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default JobBoardSidebar;
