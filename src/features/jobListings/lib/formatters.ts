import {
  ExperienceLevel,
  JobListingStatus,
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

export function formatJobListingStatus(status: JobListingStatus) {
  switch (status) {
    case "published":
      return "Active";
    case "draft":
      return "Draft";
    case "delisted":
      return "Delisted";
    default:
      throw new Error(`Unknown status: ${status satisfies never}`);
  }
}

export function formatWage(wage: number, wageInterval: WageInterval) {
  const wageFormatter = new Intl.NumberFormat("en-US", {
    currency: "USD",
    minimumFractionDigits: 0,
    style: "currency",
  });

  switch (wageInterval) {
    case "hourly":
      return `${wageFormatter.format(wage)} / hr`;
    case "yearly":
      return `${wageFormatter.format(wage)}`;
    default:
      throw new Error(`Unknown wage interval: ${wageInterval satisfies never}`);
  }
}

export function formatJobListingLocation({
  city,
  stateAbbreviation,
}: {
  city: string | null;
  stateAbbreviation: string | null;
}) {
  if (stateAbbreviation === null && city === null) return "None";

  const locationParts = [];

  if (city !== null) locationParts.push(city);
  if (stateAbbreviation !== null) {
    locationParts.push(stateAbbreviation.toUpperCase());
  }

  return locationParts.join(", ");
}
