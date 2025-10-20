import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import LoadingSpinner from "@/components/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import NotificationForm from "@/features/users/components/NotificationForm";
import { getNotificationSettings } from "@/features/users/db/userNotificationSettings";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";

export const metadata: Metadata = {
  description:
    "Users may configure their notification preferences to receive alerts regarding specific job listings.",
  title: "Notification Settings | Job Board",
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
  if (!user) return notFound();

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Notification Settings</h1>
      <Card>
        <CardContent>
          <Suspense fallback={<LoadingSpinner />}>
            <SuspendedForm userId={user.id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

export async function SuspendedForm({ userId }: { userId: string }) {
  const notificationSettings = await getNotificationSettings(userId);

  return <NotificationForm notificationSettings={notificationSettings} />;
}

export default NotificationPage;
