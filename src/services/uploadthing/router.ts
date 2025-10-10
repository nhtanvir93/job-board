import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import {
  getUserResumeFileKey,
  upsertUserResume,
} from "@/features/users/db/userResumes";

import { getCurrentUser } from "../clerk/lib/getCurrentAuth";
import { inngest } from "../inngest/client";
import { uploadthing } from "./client";

const f = createUploadthing();

export const customFileRouter = {
  resumeUploader: f(
    {
      pdf: {
        maxFileCount: 1,
        maxFileSize: "8MB",
      },
    },
    {
      awaitServerData: true,
    },
  )
    .middleware(async () => {
      const user = await getCurrentUser();
      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { userId } = metadata;

      const resumeFileKey = await getUserResumeFileKey(userId);

      await upsertUserResume(userId, {
        resumeFileKey: file.key,
        resumeFileUrl: file.ufsUrl,
      });

      if (resumeFileKey) {
        await uploadthing.deleteFiles(resumeFileKey);
      }

      inngest.send({
        name: "app/resume:uploaded",
        user: {
          id: userId,
        },
      });

      return { message: "Resume uploaded successfully" };
    }),
} satisfies FileRouter;

export type CustomFileRouter = typeof customFileRouter;
