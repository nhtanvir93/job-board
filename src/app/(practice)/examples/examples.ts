"use server";

import { revalidateTag } from "next/cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { revalidateUserResumeCache } from "@/features/users/db/cache/userResumes";
import { upsertUserResume } from "@/features/users/db/userResumes";

const CACHE_TAG = "random-number";

const testUserIdForResume = "user_33TMOpCLBGJJkJfc81KqFF7pEOz";
const dummyUserResumeData = [
  {
    aiSummary: "AI Summary 1021",
    resumeFileKey: "resume-file-key-1021",
    resumeFileUrl: "http://resumes-files.co/resume-file-key-1021",
  },
  {
    aiSummary: "AI Summary 1022",
    resumeFileKey: "resume-file-key-1022",
    resumeFileUrl: "http://resumes-files.co/resume-file-key-1022",
  },
  {
    aiSummary: "AI Summary 1023",
    resumeFileKey: "resume-file-key-1023",
    resumeFileUrl: "http://resumes-files.co/resume-file-key-1023",
  },
];

let randomNumber = 0;

export async function getRandomNumber(): Promise<number> {
  "use cache";
  cacheTag(CACHE_TAG);

  return new Promise((resolve) => setTimeout(() => resolve(randomNumber), 100));
}

export async function generateNewRandomNumber(): Promise<{ message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      randomNumber++;
      revalidateTag(CACHE_TAG);

      resolve({ message: `1 added to old random number` });
    }, 100);
  });
}

export async function upSertUserResumeTest() {
  const currendIndex = randomNumber % dummyUserResumeData.length;

  await upsertUserResume(
    testUserIdForResume,
    dummyUserResumeData[currendIndex],
  );

  randomNumber++;

  return {
    success: true,
    updatedColumns: dummyUserResumeData[currendIndex],
  };
}

export async function revalidateUserResumeTest() {
  revalidateUserResumeCache(testUserIdForResume);

  return { message: "User resume cache revalidated successfully" };
}
