import {
  BrainCircuitIcon,
  ClipboardListIcon,
  LayoutDashboardIcon,
  LogInIcon,
} from "lucide-react";
import { ReactNode } from "react";

import AppSidebar from "@/components/sidebar/AppSidebar";
import SidebarNavMenuGroup from "@/components/sidebar/SidebarNavMenuGroup";
import SidebarUserButton from "@/features/users/components/SidebarUserButton";

const JobSeekerLayout = ({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: ReactNode;
}) => {
  return (
    <AppSidebar
      content={
        <>
          {sidebar}
          <SidebarNavMenuGroup
            items={[
              {
                href: "/",
                icon: <ClipboardListIcon />,
                label: "Job Board",
              },
              {
                href: "/ai-search",
                icon: <BrainCircuitIcon />,
                label: "AI Search",
              },
              {
                authStatus: "signedIn",
                href: "/employer",
                icon: <LayoutDashboardIcon />,
                label: "Employer Dashboard",
              },
              {
                authStatus: "signedOut",
                href: "/sign-in",
                icon: <LogInIcon />,
                label: "Log In",
              },
            ]}
            className="mt-auto"
          />
        </>
      }
      footerButton={<SidebarUserButton />}
    >
      {children}
    </AppSidebar>
  );
};

export default JobSeekerLayout;
