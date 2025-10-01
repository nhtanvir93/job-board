import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { SignedOut } from "@/services/clerk/components/AuthStatus";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";

import { SidebarUserButtonClient } from "./_SidebarUserButtonClient";

export default function SidebarUserButton() {
  return (
    <Suspense>
      <SidebarUserSuspense />
    </Suspense>
  );
}

async function SidebarUserSuspense() {
  const user = await getCurrentUser();

  if (!user) {
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
    <SidebarUserButtonClient
      user={{
        email: user.email,
        imageUrl: user.imageUrl,
        name: user.name,
      }}
    />
  );
}
