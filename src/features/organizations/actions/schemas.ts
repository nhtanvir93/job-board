import z from "zod";

export const organizationUserSettingsSchema = z.object({
  minimumRating: z.number().min(1).max(5).nullable(),
  newApplicationEmailNotifications: z.boolean(),
});
