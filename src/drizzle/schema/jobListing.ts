import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "../schemaHelper";
import { JobListingApplicationTable } from "./jobListingApplication";
import { OrganizationTable } from "./organization";

export const wageIntervals = ["hourly", "yearly"] as const;
type WageInterval = (typeof wageIntervals)[number];
export const wageIntervalEnum = pgEnum(
  "job_listings_wage_interval",
  wageIntervals,
);

export const locationRequirements = ["in-office", "hybrid", "remote"] as const;
type LocationRequirement = (typeof locationRequirements)[number];
export const locationRequirementEnum = pgEnum(
  "job_listings_location_requirement",
  locationRequirements,
);

export const experienceLevels = ["junior", "mid-level", "senior"] as const;
type ExperienceLevel = (typeof experienceLevels)[number];
export const experienceLevelEnum = pgEnum(
  "job_listings_experience_level",
  experienceLevels,
);

export const jobListingStatuses = ["draft", "published", "delisted"] as const;
type JobListingStatus = (typeof jobListingStatuses)[number];
export const jobListingStatusEnum = pgEnum(
  "job_listings_status",
  jobListingStatuses,
);

export const jobListingTypes = [
  "internship",
  "part-time",
  "full-time",
] as const;
type JobListingType = (typeof jobListingTypes)[number];
export const jobListingTypeEnum = pgEnum("job_listings_type", jobListingTypes);

export const JobListingTable = pgTable(
  "job_listings",
  {
    city: varchar(),
    createdAt,
    description: text().notNull(),
    experienceLevel: experienceLevelEnum().notNull(),
    id,
    isFeatured: boolean().notNull().default(false),
    locationRequirement: locationRequirementEnum().notNull(),
    organizationId: varchar()
      .references(() => OrganizationTable.id, { onDelete: "cascade" })
      .notNull(),
    postedAt: timestamp({ withTimezone: true }),
    stateAbbreviation: varchar(),
    status: jobListingStatusEnum().notNull(),
    title: varchar().notNull(),
    type: jobListingTypeEnum().notNull(),
    updatedAt,
    wage: integer(),
    wageInterval: wageIntervalEnum(),
  },
  (table) => [index().on(table.stateAbbreviation)],
);

export const jobListingRelations = relations(
  JobListingTable,
  ({ one, many }) => ({
    applications: many(JobListingApplicationTable),
    organization: one(OrganizationTable, {
      fields: [JobListingTable.organizationId],
      references: [OrganizationTable.id],
    }),
  }),
);
