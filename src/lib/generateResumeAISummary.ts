import { env } from "@/data/env/server";

type ExtractPdfResult =
  | { error: true; message: string }
  | { error: false; pdfContent: string };

export async function extractPdfContents(
  pdfUrl: string,
): Promise<ExtractPdfResult> {
  const response = await fetch(env.PDF_CO_API, {
    body: JSON.stringify({ url: pdfUrl }),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.PDF_CO_API_KEY,
    },
    method: "POST",
  });

  const extractData = await response.json();

  const textFileUrl = extractData?.url;
  if (!textFileUrl) {
    return {
      error: true,
      message: "Failed to extract pdf content",
    };
  }

  const textResponse = await fetch(textFileUrl);
  const extractedText = await textResponse.text();

  return {
    error: false,
    pdfContent: extractedText,
  };
}

type GenerateAISummaryResult =
  | { error: true; message: string }
  | { error: false; aiSummary: string };

export async function generateResumeAISummary(
  pdfContent: string,
): Promise<GenerateAISummaryResult> {
  const geminiRes = await fetch(env.GEMINI_FLASH_API, {
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `Summarize the following resume and extract all key skills, experience and qualifications. The summary should include all the information that a hiring manager would need to know about the candidate in order to determine if he is a good fit for a job. This summary should be formatted as markdown. Do not return any ohter text. If the file does not look a resume return the text 'N/A':\n\n${pdfContent}`,
            },
          ],
        },
      ],
    }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  const geminiData = await geminiRes.json();
  const aiSummary = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!aiSummary) {
    return {
      error: true,
      message: "No AI summary generated.",
    };
  }

  return {
    aiSummary,
    error: false,
  };
}
