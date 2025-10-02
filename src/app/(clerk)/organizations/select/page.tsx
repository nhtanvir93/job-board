import { OrganizationList } from "@clerk/nextjs";
import { Suspense } from "react";

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
