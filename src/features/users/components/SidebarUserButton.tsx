import { Suspense } from "react";

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

  if (!user) return <p>No loggedin User found</p>;

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
