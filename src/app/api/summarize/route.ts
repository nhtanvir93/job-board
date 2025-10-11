import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/drizzle/db";
import { UserResumeTable } from "@/drizzle/schema";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const pdfUrl = searchParams.get("pdfUrl");

  if (!pdfUrl) return NextResponse.json({ message: "No pdf url provided" });

  const response = await fetch("https://api.pdf.co/v1/pdf/convert/to/text", {
    body: JSON.stringify({ url: pdfUrl }),
    headers: {
      "Content-Type": "application/json",
      "x-api-key":
        "mohammed.tanvir447@gmail.com_wCNgajohCftmzGwBwgUETpZdWOsoHFZ9pCP7KN6yQlqeirehwXHaiqLryfD7ada1",
    },
    method: "POST",
  });

  const extractData = await response.json();

  const textFileUrl = extractData?.url;
  if (!textFileUrl) {
    return NextResponse.json({ error: "Failed to extract text" });
  }

  const textResponse = await fetch(textFileUrl);
  const extractedText = await textResponse.text();

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=AIzaSyDelCPXZt7QYVBG_6Xxh73vwEd5IUhNJhc`,
    {
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Summarize the following resume and extract all key skills, experience and qualifications. The summary should include all the information that a hiring manager would need to know about the candidate in order to determine if he is a good fit for a job. This summary should be formatted as markdown. Do not return any ohter text. If the file does not look a resume return the text 'N/A':\n\n${extractedText}`,
              },
            ],
          },
        ],
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    },
  );

  const geminiData = await geminiRes.json();
  const summary =
    geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No summary generated.";

  await db.update(UserResumeTable).set({aiSummary: summary}).where(eq(UserResumeTable.userId, 'user_33TMOpCLBGJJkJfc81KqFF7pEOz'));

  return NextResponse.json({
    summary,
  });
}
