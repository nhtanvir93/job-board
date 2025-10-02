import { ClipboardListIcon, LogInIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";

import AppSidebar from "@/components/sidebar/AppSidebar";
import SidebarNavMenuGroup from "@/components/sidebar/SidebarNavMenuGroup";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import SidebarOrganizationButton from "@/features/organizations/components/SidebarOrganizationButton";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";

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
            <SidebarGroupAction title="Add Job Listing" asChild>
              <Link href="/employer/job-listings/new">
                <PlusIcon className="mr-1" />
                <span className="sr-only">Add Job Listing</span>
              </Link>
            </SidebarGroupAction>
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

export default EmployerLayout;
