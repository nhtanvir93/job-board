import { OrganizationList } from "@clerk/nextjs";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  description: "User can switch to a different organization.",
  title: "Switch Organization | Job Board",
};

interface Props {
  searchParams: Promise<{ redirect?: string }>;
}

const OrganizationSelectPage = (props: Props) => {
  return (
    <Suspense>
      <OrganizationSelectPageSuspense {...props} />
    </Suspense>
  );
};

const OrganizationSelectPageSuspense = async ({ searchParams }: Props) => {
  const { redirect } = await searchParams;
  const redirectUrl = redirect ?? "/employer";

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <OrganizationList
        hidePersonal
        hideSlug
        skipInvitationScreen
        afterCreateOrganizationUrl={redirectUrl}
        afterSelectOrganizationUrl={redirectUrl}
      />
    </div>
  );
};

export default OrganizationSelectPage;
