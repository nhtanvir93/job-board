ALTER TABLE "user_notification_settings" DROP CONSTRAINT "user_notification_settings_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_notification_settings" ADD CONSTRAINT "user_notification_settings_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;