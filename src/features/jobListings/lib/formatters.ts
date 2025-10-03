import {
  ExperienceLevel,
  JobListingType,
  LocationRequirement,
  WageInterval,
} from "@/drizzle/schema";

export function formatWageInterval(interval: WageInterval) {
  switch (interval) {
    case "hourly":
      return "Hour";
    case "yearly":
      return "Year";
    default:
      throw new Error(`Invalid wage interval: ${interval satisfies never}`);
  }
}

export function formatLocationRequirement(
  locationRequirement: LocationRequirement,
) {
  switch (locationRequirement) {
    case "in-office":
      return "In Office";
    case "hybrid":
      return "Hybrid";
    case "remote":
      return "Remote";
    default:
      throw new Error(
        `Invalid wage interval: ${locationRequirement satisfies never}`,
      );
  }
}

export function formatJobListingType(jobListingType: JobListingType) {
  switch (jobListingType) {
    case "full-time":
      return "Full Time";
    case "part-time":
      return "Part Time";
    case "internship":
      return "Internship";
    default:
      throw new Error(
        `Invalid wage interval: ${jobListingType satisfies never}`,
      );
  }
}

export function formatExperienceLevel(experienceLevel: ExperienceLevel) {
  switch (experienceLevel) {
    case "junior":
      return "Junior";
    case "mid-level":
      return "Mid Level";
    case "senior":
      return "Senior";
    default:
      throw new Error(
        `Invalid wage interval: ${experienceLevel satisfies never}`,
      );
  }
}
