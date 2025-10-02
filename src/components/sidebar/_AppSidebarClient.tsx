"use client";

import { ReactNode } from "react";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

const AppSidebarClient = ({ children }: { children: ReactNode }) => {
  const { isMobile } = useSidebar();

  if (!isMobile) return children;

  return (
    <div className="flex flex-col w-full">
      <div className="p-2 border-b flex items-center gap-1">
        <SidebarTrigger />
        <span className="text-xl text-nowrap">Job Board</span>
      </div>
      <div className="flex flex-1">{children}</div>
    </div>
  );
};

export default AppSidebarClient;
