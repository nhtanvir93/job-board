import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import LoadingSpinner from "@/components/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import NotificationForm from "@/features/organizations/components/NotificationForm";
import { getOrganizationUserSettings } from "@/features/organizations/db/organizationUserSettings";
import {
  getCurrentOrganization,
  getCurrentUser,
} from "@/services/clerk/lib/getCurrentAuth";

export const metadata: Metadata = {
  description:
    "Organization users may configure their notification preferences to receive alerts regarding specific job listings applications.",
  title: "Organization User Notification Settings | Job Board",
};

const NotificationPage = () => {
  return (
    <Suspense>
      <SuspendedComponent />
    </Suspense>
  );
};

export async function SuspendedComponent() {
  const user = await getCurrentUser();
  const organization = await getCurrentOrganization();

  if (!user || !organization) return notFound();

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Notification Settings</h1>
      <Card>
        <CardContent>
          <Suspense fallback={<LoadingSpinner />}>
            <SuspendedForm userId={user.id} organizationId={organization.id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

export async function SuspendedForm({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) {
  const notificationSettings = await getOrganizationUserSettings({
    organizationId,
    userId,
  });

  return <NotificationForm notificationSettings={notificationSettings} />;
}

export default NotificationPage;
