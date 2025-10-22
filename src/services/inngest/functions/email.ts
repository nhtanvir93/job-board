import { subDays } from "date-fns";
import { and, eq, gte } from "drizzle-orm";
import { GetEvents } from "inngest";

import { db } from "@/drizzle/db";
import {
  JobListingTable,
  UserNotificationSettingsTable,
} from "@/drizzle/schema";
import { resend } from "@/services/resend/client";
import DailyJobListingEmail from "@/services/resend/components/DailyJobListingEmail";

import { getMatchedJobListings } from "../ai/getMatchedJobListings";
import { inngest } from "../client";

export const prepareDailyUserJobListingNotifications = inngest.createFunction(
  {
    id: "prepare-daily-user-job-listing-notifications",
    name: "Prepare Daily User Job Listing Notificaions",
  },
  {
    cron: "TZ=Asia/Dhaka 0 7 * * *",
  },
  async ({ step, event }) => {
    const getUsers = step.run("get-users", async () => {
      return await db.query.UserNotificationSettingsTable.findMany({
        columns: {
          aiPrompt: true,
          newJobEmailNotifications: true,
          userId: true,
        },
        where: eq(UserNotificationSettingsTable.newJobEmailNotifications, true),
        with: {
          user: {
            columns: {
              email: true,
              name: true,
            },
          },
        },
      });
    });

    const getJobListings = step.run("get-recent-job-listings", async () => {
      return await db.query.JobListingTable.findMany({
        columns: {
          createdAt: false,
          organizationId: false,
          postedAt: false,
          status: false,
          updatedAt: false,
        },
        where: and(
          gte(
            JobListingTable.postedAt,
            subDays(new Date(event.ts ?? Date.now()), 1),
          ),
          eq(JobListingTable.status, "published"),
        ),
        with: {
          organization: {
            columns: {
              name: true,
            },
          },
        },
      });
    });

    const [userNotifications, jobListings] = await Promise.all([
      getUsers,
      getJobListings,
    ]);

    if (jobListings.length === 0 || userNotifications.length === 0) return;

    const events = userNotifications.map((notification) => {
      return {
        data: {
          aiPrompt: notification.aiPrompt ?? undefined,
          jobListings: jobListings.map((jobListing) => {
            return {
              ...jobListing,
              organizationName: jobListing.organization.name,
            };
          }),
        },
        name: "app/email.daily-user-job-listings",
        user: {
          email: notification.user.email,
          name: notification.user.name,
        },
      } as const satisfies GetEvents<
        typeof inngest
      >["app/email.daily-user-job-listings"];
    });

    step.sendEvent("send-emails", events);
  },
);

export const sendDailyUserJobListingEmail = inngest.createFunction(
  {
    id: "send-daily-user-job-listing-email",
    name: "Send Daily User Job Listing Email",
    throttle: {
      limit: 10,
      period: "1m",
    },
  },
  {
    event: "app/email.daily-user-job-listings",
  },
  async ({ event, step }) => {
    const { jobListings, aiPrompt } = event.data;
    const user = event.user;

    if (jobListings.length === 0) {
      return;
    }

    let matchingJobListings: typeof jobListings = [];

    if (!aiPrompt || aiPrompt.trim() === "") {
      matchingJobListings = jobListings;
    } else {
      const matchingIds = await getMatchedJobListings(aiPrompt, jobListings);
      matchingJobListings = jobListings.filter((jobListing) =>
        matchingIds.includes(jobListing.id),
      );
    }

    if (matchingJobListings.length === 0) {
      return;
    }

    await step.run("send-email", async () => {
      await resend.emails.send({
        from: "Job Board <onboarding@resend.dev>",
        react: DailyJobListingEmail(),
        subject: "Daily Job Listings",
        to: user.email,
      });
    });
  },
);
