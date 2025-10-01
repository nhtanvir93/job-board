import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import SidebarUserButton from "@/features/users/components/SidebarUserButton";

import AppSidebarClient from "./_AppSidebarClient";

const HomePage = () => {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSidebarClient>
        <Sidebar collapsible="icon" className="flex flex-col overflow-hidden">
          <SidebarHeader className="flex-row">
            <SidebarTrigger />
            <span className="text-xl text-nowrap">Job Board</span>
          </SidebarHeader>
          <SidebarContent className="flex-1 overflow-y-auto"></SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarUserButton />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1">Lorem ipsum dolor sit.</main>
      </AppSidebarClient>
    </SidebarProvider>
  );
};

export default HomePage;
