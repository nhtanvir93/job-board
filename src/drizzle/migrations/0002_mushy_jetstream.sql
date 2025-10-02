ALTER TABLE "organization_user_settings" DROP CONSTRAINT "organization_user_settings_organizationId_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_user_settings" DROP CONSTRAINT "organization_user_settings_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_resumes" DROP CONSTRAINT "user_resumes_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_user_settings" ADD CONSTRAINT "organization_user_settings_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_user_settings" ADD CONSTRAINT "organization_user_settings_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_resumes" ADD CONSTRAINT "user_resumes_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;