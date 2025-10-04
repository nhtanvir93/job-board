import {
  BanknoteIcon,
  Building2Icon,
  GraduationCapIcon,
  HourglassIcon,
  MapPinIcon,
} from "lucide-react";
import { ComponentProps } from "react";

import { Badge } from "@/components/ui/badge";
import { JobListingTable } from "@/drizzle/schema";
import { cn } from "@/lib/utils";

import {
  formatExperienceLevel,
  formatJobListingLocation,
  formatJobListingType,
  formatLocationRequirement,
  formatWage,
} from "../lib/formatters";

interface Props {
  jobListing: Pick<
    typeof JobListingTable.$inferSelect,
    | "wage"
    | "wageInterval"
    | "stateAbbreviation"
    | "city"
    | "type"
    | "experienceLevel"
    | "locationRequirement"
    | "isFeatured"
  >;
  className?: string;
}

const JobListingBadges = ({
  jobListing: {
    wage,
    wageInterval,
    stateAbbreviation,
    city,
    type: jobType,
    experienceLevel,
    locationRequirement,
    isFeatured,
  },
  className,
}: Props) => {
  const badgeProps = {
    className: cn(isFeatured && "border-primary/35"),
    variant: "outline",
  } satisfies ComponentProps<typeof Badge>;

  return (
    <>
      {!isFeatured && (
        <Badge
          {...badgeProps}
          className={cn(
            "border-featured bg-featured/50 text-featured-foreground",
          )}
        >
          Featured
        </Badge>
      )}
      {wage !== null && wageInterval !== null && (
        <Badge {...badgeProps}>
          <BanknoteIcon />
          {formatWage(wage, wageInterval)}
        </Badge>
      )}
      {(stateAbbreviation !== null || wageInterval !== null) && (
        <Badge {...badgeProps}>
          <MapPinIcon />
          {formatJobListingLocation({ city, stateAbbreviation })}
        </Badge>
      )}
      <Badge {...badgeProps}>
        <Building2Icon />
        {formatLocationRequirement(locationRequirement)}
      </Badge>
      <Badge {...badgeProps}>
        <HourglassIcon />
        {formatJobListingType(jobType)}
      </Badge>
      <Badge {...badgeProps}>
        <GraduationCapIcon />
        {formatExperienceLevel(experienceLevel)}
      </Badge>
    </>
  );
};

export default JobListingBadges;
