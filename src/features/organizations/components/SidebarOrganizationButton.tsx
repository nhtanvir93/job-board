import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { SignedOut } from "@/services/clerk/components/AuthStatus";
import {
  getCurrentOrganization,
  getCurrentUser,
} from "@/services/clerk/lib/getCurrentAuth";

import { SidebarOrganizationButtonClient } from "./_SidebarOrganizationButtonClient";

export default function SidebarOrganizationButton() {
  return (
    <Suspense>
      <SidebarOrganizationSuspense />
    </Suspense>
  );
}

async function SidebarOrganizationSuspense() {
  const [organization, user] = await Promise.all([
    getCurrentOrganization(),
    getCurrentUser(),
  ]);

  if (!organization || !user) {
    return (
      <SignedOut>
        <SidebarMenuButton asChild>
          <Link href="/sign-in">
            <LogInIcon className="mr-1" />
            Log In
          </Link>
        </SidebarMenuButton>
      </SignedOut>
    );
  }

  return (
    <SidebarOrganizationButtonClient user={user} organization={organization} />
  );
}
