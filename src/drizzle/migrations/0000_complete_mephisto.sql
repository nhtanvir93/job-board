CREATE TYPE "public"."job_listings_experience_level" AS ENUM('junior', 'mid-level', 'senior');--> statement-breakpoint
CREATE TYPE "public"."job_listings_status" AS ENUM('draft', 'published', 'delisted');--> statement-breakpoint
CREATE TYPE "public"."job_listings_type" AS ENUM('internship', 'part-time', 'full-time');--> statement-breakpoint
CREATE TYPE "public"."job_listings_location_requirement" AS ENUM('in-office', 'hybrid', 'remote');--> statement-breakpoint
CREATE TYPE "public"."job_listings_wage_interval" AS ENUM('hourly', 'yearly');--> statement-breakpoint
CREATE TYPE "public"."job_listing_applications_stage" AS ENUM('applied', 'denied', 'interested', 'interviewed', 'hired');--> statement-breakpoint
CREATE TABLE "job_listings" (
	"city" varchar,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"description" text NOT NULL,
	"experienceLevel" "job_listings_experience_level" NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"isFeatured" boolean DEFAULT false NOT NULL,
	"locationRequirement" "job_listings_location_requirement" NOT NULL,
	"organizationId" varchar NOT NULL,
	"postedAt" timestamp with time zone,
	"stateAbbreviation" varchar,
	"status" "job_listings_status" NOT NULL,
	"title" varchar NOT NULL,
	"type" "job_listings_type" NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"wage" integer,
	"wageInterval" "job_listings_wage_interval"
);
--> statement-breakpoint
CREATE TABLE "job_listing_applications" (
	"coverLetter" varchar,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"jobListingId" uuid,
	"rating" integer,
	"stage" "job_listing_applications_stage" DEFAULT 'applied' NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"userId" varchar,
	CONSTRAINT "job_listing_applications_jobListingId_userId_pk" PRIMARY KEY("jobListingId","userId")
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"imageUrl" varchar,
	"name" varchar NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization_user_settings" (
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"minimumRating" integer,
	"newApplicationEmailNotifications" boolean DEFAULT false NOT NULL,
	"organizationId" varchar,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"userId" varchar,
	CONSTRAINT "organization_user_settings_userId_organizationId_pk" PRIMARY KEY("userId","organizationId")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"email" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"imageUrl" varchar NOT NULL,
	"name" varchar NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_notification_settings" (
	"aiPrompt" varchar,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"newJobEmailNotifications" boolean DEFAULT false NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"userId" varchar PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_resumes" (
	"aiSummary" varchar,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"resumeFileKey" varchar NOT NULL,
	"resumeFileUrl" varchar NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"userId" varchar PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "job_listings" ADD CONSTRAINT "job_listings_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_listing_applications" ADD CONSTRAINT "job_listing_applications_jobListingId_job_listings_id_fk" FOREIGN KEY ("jobListingId") REFERENCES "public"."job_listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_listing_applications" ADD CONSTRAINT "job_listing_applications_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_user_settings" ADD CONSTRAINT "organization_user_settings_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_user_settings" ADD CONSTRAINT "organization_user_settings_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notification_settings" ADD CONSTRAINT "user_notification_settings_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_resumes" ADD CONSTRAINT "user_resumes_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "job_listings_stateAbbreviation_index" ON "job_listings" USING btree ("stateAbbreviation");