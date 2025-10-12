import Link from "next/link";
import { Suspense } from "react";

import { findUserResumeByUserId } from "@/features/users/db/userResumes";

import ModifyBtnClient from "./_ModifyBtnClient";

const UserResumeExamplePage = () => {
  return (
    <Suspense>
      <SuspendedPage />
    </Suspense>
  );
};

async function SuspendedPage() {
  const testUserIdForResume = "user_33TMOpCLBGJJkJfc81KqFF7pEOz";
  const userResume = await findUserResumeByUserId(testUserIdForResume);

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4">
      <div className="p-6 border-2 flex flex-col justify-center items-center rounded-2xl">
        {userResume && (
          <>
            <div className="text-3xl">
              <span className="font-extrabold">Resume File Key : </span>
              {userResume.resumeFileKey}
            </div>
            <div className="text-3xl">
              <span className="font-extrabold">Resume File Url : </span>
              <Link
                className="text-blue-500"
                href={userResume.resumeFileUrl!}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume
              </Link>
            </div>
          </>
        )}
        {!userResume && (
          <p className="text-3xl text-red-700">No User Resume Found</p>
        )}
      </div>
      <ModifyBtnClient />
    </div>
  );
}

export default UserResumeExamplePage;
