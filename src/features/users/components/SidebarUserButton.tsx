import { Suspense } from "react";

import { SidebarUserButtonClient } from "./_SidebarUserButtonClient";

export default function SidebarUserButton() {
  return (
    <Suspense>
      <SidebarUserSuspense />
    </Suspense>
  );
}

async function SidebarUserSuspense() {
  return (
    <SidebarUserButtonClient
      user={{
        email: "tanvir.eatl@gmail.com",
        imageUrl: "",
        name: "Mohammed Tanvir",
      }}
    />
  );
}
