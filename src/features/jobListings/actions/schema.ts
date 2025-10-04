import z from "zod";

import {
  experienceLevels,
  jobListingTypes,
  locationRequirements,
  wageIntervals,
} from "@/drizzle/schema";

export const jobListingSchema = z
  .object({
    city: z
      .string()
      .transform((val) => (val.trim() === "" ? null : val))
      .nullable(),
    description: z.string().min(1, "Required"),
    experienceLevel: z.enum(experienceLevels),
    locationRequirement: z.enum(locationRequirements),
    stateAbbreviation: z
      .string()
      .transform((val) => (val.trim() === "" ? null : val))
      .nullable(),
    title: z.string().min(1, "Required"),
    type: z.enum(jobListingTypes),
    wage: z.number().int().positive().min(1).nullable(),
    wageInterval: z.enum(wageIntervals).nullable(),
  })
  .refine(
    (listing) => {
      return listing.locationRequirement === "remote" || listing.city !== null;
    },
    {
      message: "Required for non-remote listings",
      path: ["city"],
    },
  )
  .refine(
    (listing) => {
      return (
        listing.locationRequirement === "remote" ||
        listing.stateAbbreviation !== null
      );
    },
    {
      message: "Required for non-remote listings",
      path: ["stateAbbreviation"],
    },
  );
