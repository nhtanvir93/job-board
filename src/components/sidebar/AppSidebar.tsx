import { ReactNode } from "react";

import { SignedIn } from "@/services/clerk/components/AuthStatus";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../ui/sidebar";
import AppSidebarClient from "./_AppSidebarClient";

interface Props {
  children: ReactNode;
  content: ReactNode;
  footerButton: ReactNode;
}

const AppSidebar = ({ children, content, footerButton }: Props) => {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSidebarClient>
        <Sidebar collapsible="icon" className="flex flex-col overflow-hidden">
          <SidebarHeader className="flex-row">
            <SidebarTrigger />
            <span className="text-xl text-nowrap">Job Board</span>
          </SidebarHeader>
          <SidebarContent className="flex-1 overflow-y-auto">
            {content}
          </SidebarContent>
          <SignedIn>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>{footerButton}</SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </SignedIn>
        </Sidebar>
        <main className="flex-1">{children}</main>
      </AppSidebarClient>
    </SidebarProvider>
  );
};

export default AppSidebar;
