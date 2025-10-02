"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import { SignedIn, SignedOut } from "@/services/clerk/components/AuthStatus";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

interface Props {
  items: {
    href: string;
    icon: ReactNode;
    label: string;
    authStatus?: "signedOut" | "signedIn";
  }[];
  className?: string;
}

export default function SidebarNavMenuGroup({ items, className }: Props) {
  const path = usePathname();

  return (
    <SidebarGroup className={className}>
      <SidebarMenu>
        {items.map((item) => {
          const html = (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={path === item.href}>
                <Link href={item.href}>
                  {item.icon}
                  <span className="ml-1">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );

          if (item.authStatus === "signedIn") {
            return <SignedIn key={item.href}>{html}</SignedIn>;
          }

          if (item.authStatus === "signedOut") {
            return <SignedOut key={item.href}>{html}</SignedOut>;
          }

          return html;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
