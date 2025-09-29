import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { createdAt, updatedAt } from "../schemaHelper";
import { JobListingTable } from "./jobListing";
import { UserTable } from "./user";

export const applicationStages = [
  "applied",
  "denied",
  "interested",
  "interviewed",
  "hired",
] as const;
type ApplicationStage = (typeof applicationStages)[number];
export const applicationStageEnum = pgEnum(
  "job_listing_applications_stage",
  applicationStages,
);

export const JobListingApplicationTable = pgTable(
  "job_listing_applications",
  {
    coverLetter: varchar(),
    createdAt,
    jobListingId: uuid().references(() => JobListingTable.id, {
      onDelete: "cascade",
    }),
    rating: integer(),
    stage: applicationStageEnum().notNull().default("applied"),
    updatedAt,
    userId: varchar().references(() => UserTable.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.jobListingId, table.userId] })],
);

export const jobListingApplicationRelations = relations(
  JobListingApplicationTable,
  ({ one }) => ({
    jobListing: one(JobListingTable, {
      fields: [JobListingApplicationTable.jobListingId],
      references: [JobListingTable.id],
    }),
    user: one(UserTable, {
      fields: [JobListingApplicationTable.userId],
      references: [UserTable.id],
    }),
  }),
);
