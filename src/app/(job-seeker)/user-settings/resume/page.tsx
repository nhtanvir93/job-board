import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import MarkdownRenderer from "@/components/markdown/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { findUserResumeByUserId } from "@/features/users/db/userResumes";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";

import DropzoneClient from "./_DropzoneClient";

export const metadata: Metadata = {
  description: "User can upload resume to apply for a job.",
  title: "Upload Resume | Job Board",
};

const UserResumePage = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6 px-4">
      <h1 className="text-2xl font-bold">Upload Your Resume</h1>
      <Card>
        <CardContent>
          <DropzoneClient />
        </CardContent>
        <Suspense>
          <ResumeDetails />
        </Suspense>
      </Card>
      <Suspense>
        <AISummaryCard />
      </Suspense>
    </div>
  );
};

async function ResumeDetails() {
  const user = await getCurrentUser();
  if (!user) return notFound();

  const userResume = await findUserResumeByUserId(user.id);
  if (!userResume?.resumeFileUrl) return null;

  console.log("Client ResumeFileKey", userResume.resumeFileKey);

  return (
    <CardFooter>
      <Button asChild>
        <Link
          href={userResume.resumeFileUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Resume
        </Link>
      </Button>
    </CardFooter>
  );
}

async function AISummaryCard() {
  const user = await getCurrentUser();
  if (!user) return notFound();

  const userResume = await findUserResumeByUserId(user.id);
  if (!userResume || (userResume && userResume.aiSummary === null)) return null;

  return (
    <Card className="border-b p-4">
      <CardTitle>AI Summary</CardTitle>
      <CardDescription>
        This is an AI-generated summary of your resume. This is used by
        employers to quickly understand your qualifications and experience.
      </CardDescription>
      <CardContent>
        <MarkdownRenderer source={userResume.aiSummary!} />
      </CardContent>
    </Card>
  );
}

export default UserResumePage;
