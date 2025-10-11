import {
  findUserResumeByUserId,
  upsertUserResume,
} from "@/features/users/db/userResumes";
import {
  extractPdfContents,
  generateResumeAISummary,
} from "@/lib/generateResumeAISummary";

import { inngest } from "../client";

export const createAISummaryOfUploadedResume = inngest.createFunction(
  {
    id: "create-ai-summary-of-uploaded-resume",
    name: "Create AI Summary of Uploaded Resume",
  },
  {
    event: "app/resume:uploaded",
  },
  async ({ step, event }) => {
    const { id: userId } = event.user;

    const userResume = await step.run("get-user-resume", async () => {
      return findUserResumeByUserId(userId);
    });
    if (!userResume?.resumeFileUrl) return;

    const result = await step.run("extract-pdf-content", async () => {
      return extractPdfContents(userResume.resumeFileUrl as string);
    });
    if (result.error) return;

    const { pdfContent } = result;
    const aiResult = await step.run("create-ai-summary", async () => {
      return generateResumeAISummary(pdfContent);
    });

    if (aiResult.error) return;

    const { aiSummary } = aiResult;
    await step.run("save-ai-summary", async () => {
      return upsertUserResume(userId, { aiSummary });
    });
  },
);
