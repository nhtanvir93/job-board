import { createAgent, gemini } from "@inngest/agent-kit";
import z from "zod";

import { env } from "@/data/env/server";
import {
  experienceLevels,
  jobListingTypes,
  locationRequirements,
  wageIntervals,
} from "@/drizzle/schema";

import { getLastOutputMessage } from "./getLastOutputMessage";

const jobListingSchema = z.object({
  city: z.string().nullable(),
  description: z.string(),
  experienceLevel: z.enum(experienceLevels),
  id: z.string(),
  locationRequirement: z.enum(locationRequirements),
  stateAbbreviation: z.string().nullable(),
  title: z.string(),
  type: z.enum(jobListingTypes),
  wage: z.number().nullable(),
  wageInterval: z.enum(wageIntervals).nullable(),
});

export async function getMatchedJobListings(
  prompt: string,
  jobListings: z.infer<typeof jobListingSchema>[],
  {
    maxNumberOfJobs,
  }: {
    maxNumberOfJobs?: number;
  } = {},
) {
  const NO_JOBS = "NO_JOBS";

  const agent = createAgent({
    description: "Agent for matching users with job listings",
    model: gemini({
      apiKey: env.GEMINI_FLASH_API_KEY,
      model: "gemini-2.5-flash",
    }),
    name: "Job Matching Agent",
    system: `You are an expert at matching people with jobs based on their specific experience, and requirements. The provided user prompt will be a description that can include information about themselves as well what they are looking for in a job. ${
      maxNumberOfJobs
        ? `You are to return up to ${maxNumberOfJobs} jobs.`
        : `Return all jobs that match their requirements.`
    } Return the jobs as a comma separated list of jobIds. If you cannot find any jobs that match the user prompt, return the text "${NO_JOBS}". Here is the JSON array of available job listings: ${JSON.stringify(
      jobListings.map((jobListing) =>
        jobListingSchema
          .transform((jobListing) => ({
            ...jobListing,
            city: jobListing.city ?? undefined,
            locationRequirement: jobListing.locationRequirement ?? undefined,
            stateAbbreviation: jobListing.stateAbbreviation ?? undefined,
            wage: jobListing.wage ?? undefined,
            wageInterval: jobListing.wageInterval ?? undefined,
          }))
          .parse(jobListing),
      ),
    )}`,
  });

  const result = await agent.run(prompt);
  const lastMessage = getLastOutputMessage(result);

  if (!lastMessage || lastMessage === NO_JOBS) return [];

  return lastMessage
    .split(",")
    .map((jobId) => jobId.trim())
    .filter(Boolean);
}
