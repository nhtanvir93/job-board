import { ClipboardListIcon, LogInIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

import AppSidebar from "@/components/sidebar/AppSidebar";
import SidebarNavMenuGroup from "@/components/sidebar/SidebarNavMenuGroup";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import SidebarUserButton from "@/features/users/components/SidebarUserButton";

const EmployerLayout = ({ children }: { children: ReactNode }) => {
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
      footerButton={<SidebarUserButton />}
    >
      {children}
    </AppSidebar>
  );
};

export default EmployerLayout;
