import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import AppSidebarClient from "./_AppSidebarClient";

const HomePage = () => {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSidebarClient>
        <Sidebar collapsible="icon" className="overflow-hidden">
          <SidebarHeader className="flex-row">
            <SidebarTrigger />
            <span className="text-xl text-nowrap">Job Board</span>
          </SidebarHeader>
          <SidebarContent>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore,
            eaque quae. Neque totam minima aliquid a eius dolor voluptatum
            exercitationem.
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Lorem, ipsum.</SidebarMenuButton>
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
