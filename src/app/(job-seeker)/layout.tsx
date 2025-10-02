import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

import AppSidebar from "@/components/sidebar/AppSidebar";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import SidebarUserButton from "@/features/users/components/SidebarUserButton";
import { SignedOut } from "@/services/clerk/components/AuthStatus";

const JobSeekerLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AppSidebar
      content={
        <SidebarGroup>
          <SidebarMenu>
            <SignedOut>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/sign-in">
                    <LogInIcon className="mr-1" />
                    <span>Log In</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SignedOut>
          </SidebarMenu>
        </SidebarGroup>
      }
      footerButton={<SidebarUserButton />}
    >
      {children}
    </AppSidebar>
  );
};

export default JobSeekerLayout;
