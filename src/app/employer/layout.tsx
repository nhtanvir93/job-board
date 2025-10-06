import { ClipboardListIcon, LogInIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";

import { AsyncIf } from "@/components/AsyncIf";
import AppSidebar from "@/components/sidebar/AppSidebar";
import SidebarNavMenuGroup from "@/components/sidebar/SidebarNavMenuGroup";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { JobListingStatus } from "@/drizzle/schema";
import { getJobListings } from "@/features/jobListings/db/jobListings";
import { sortJobListingsByStatus } from "@/features/jobListings/lib/utils";
import SidebarOrganizationButton from "@/features/organizations/components/SidebarOrganizationButton";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUserPermissions";

import JobListingMenuGroup from "./_JobListingMenuGroup";

const EmployerLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense>
      <EmployerLayoutSuspense>{children}</EmployerLayoutSuspense>
    </Suspense>
  );
};

const EmployerLayoutSuspense = async ({
  children,
}: {
  children: ReactNode;
}) => {
  const organization = await getCurrentOrganization();
  if (!organization) return redirect("/organizations/select");

  return (
    <AppSidebar
      content={
        <>
          <SidebarGroup>
            <SidebarGroupLabel>Job Listings</SidebarGroupLabel>
            <AsyncIf
              condition={() => hasOrgUserPermission("org:job_listings:create")}
            >
              <SidebarGroupAction title="Add Job Listing" asChild>
                <Link href="/employer/job-listings/new">
                  <PlusIcon className="mr-1" />
                  <span className="sr-only">Add Job Listing</span>
                </Link>
              </SidebarGroupAction>
            </AsyncIf>
            <SidebarGroupContent className="group-data-[state=collapsed]:hidden">
              <Suspense>
                <JobListingMenu orgId={organization.id} />
              </Suspense>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarNavMenuGroup
            className="mt-auto"
            items={[
              {
                href: "/",
                icon: <ClipboardListIcon />,
                label: "Job Board",
              },
              {
                authStatus: "signedOut",
                href: "/sign-in",
                icon: <LogInIcon />,
                label: "Log In",
              },
            ]}
          />
        </>
      }
      footerButton={<SidebarOrganizationButton />}
    >
      {children}
    </AppSidebar>
  );
};

async function JobListingMenu({ orgId }: { orgId: string }) {
  const jobListings = await getJobListings(orgId);

  if (
    jobListings.length === 0 &&
    (await hasOrgUserPermission("org:job_listings:create"))
  ) {
    return (
      <SidebarMenu>
        <SidebarMenuButton asChild>
          <Link href="/employer/job-listings/new">
            <PlusIcon />
            <span>Create your first job listing</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenu>
    );
  }

  return Object.entries(Object.groupBy(jobListings, (j) => j.status))
    .sort(([a], [b]) =>
      sortJobListingsByStatus(a as JobListingStatus, b as JobListingStatus),
    )
    .map(([status, jobListings]) => (
      <JobListingMenuGroup
        key={status}
        status={status as JobListingStatus}
        jobListings={jobListings}
      />
    ));
}

export default EmployerLayout;
