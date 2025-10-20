import z from "zod";

export const userNotificationSettingsSchema = z.object({
  aiPrompt: z
    .string()
    .transform((val) => (val.trim() === "" ? null : val))
    .nullable(),
  newJobEmailNotifications: z.boolean(),
});
