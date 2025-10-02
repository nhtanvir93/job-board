import { ReactNode } from "react";

import AppSidebar from "@/components/sidebar/AppSidebar";
import SidebarUserButton from "@/features/users/components/SidebarUserButton";

const EmployerLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AppSidebar content={<p>Content</p>} footerButton={<SidebarUserButton />}>
      {children}
    </AppSidebar>
  );
};

export default EmployerLayout;
