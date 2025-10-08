"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

import LoadingSwap from "@/components/LoadingSwap";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ExperienceLevel,
  experienceLevels,
  JobListingType,
  jobListingTypes,
  LocationRequirement,
  locationRequirements,
} from "@/drizzle/schema";

import {
  formatExperienceLevel,
  formatJobListingType,
  formatLocationRequirement,
} from "../lib/formatters";
import StateSelectItems from "./StateSelectItems";

const ANY_VALUE = "any";

const jobListingFilterSchema = z.object({
  city: z.string().optional().catch(undefined),
  experience: z
    .enum(experienceLevels)
    .or(z.literal(ANY_VALUE))
    .optional()
    .catch(undefined),
  jobType: z
    .enum(jobListingTypes)
    .or(z.literal(ANY_VALUE))
    .optional()
    .catch(undefined),
  location: z
    .enum(locationRequirements)
    .or(z.literal(ANY_VALUE))
    .optional()
    .catch(undefined),
  state: z.string().optional().catch(undefined),
  title: z.string().optional().catch(undefined),
});

const JobListingFilterForm = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      city: searchParams.get("city") ?? "",
      experience:
        (searchParams.get("experience") as ExperienceLevel) ?? ANY_VALUE,
      jobType: (searchParams.get("jobType") as JobListingType) ?? ANY_VALUE,
      location:
        (searchParams.get("location") as LocationRequirement) ?? ANY_VALUE,
      state: searchParams.get("state") ?? ANY_VALUE,
      title: searchParams.get("title") ?? "",
    },
    resolver: zodResolver(jobListingFilterSchema),
  });

  const handleSubmit = (data: z.infer<typeof jobListingFilterSchema>) => {
    const newParams = new URLSearchParams();

    if (data.city) newParams.set("city", data.city);
    if (data.state && data.state !== ANY_VALUE) {
      newParams.set("state", data.state);
    }
    if (data.title) newParams.set("title", data.title);
    if (data.experience && data.experience !== ANY_VALUE) {
      newParams.set("experience", data.experience);
    }
    if (data.jobType && data.jobType !== ANY_VALUE) {
      newParams.set("jobType", data.jobType);
    }
    if (data.location && data.location !== ANY_VALUE) {
      newParams.set("location", data.location);
    }

    router.push(`${pathname}?${newParams.toString()}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="location"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ANY_VALUE}>Any</SelectItem>
                  {locationRequirements.map((locationRequirement) => (
                    <SelectItem
                      key={locationRequirement}
                      value={locationRequirement}
                    >
                      {formatLocationRequirement(locationRequirement)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="city"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="state"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ANY_VALUE}>Any</SelectItem>
                  <StateSelectItems />
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="experience"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ANY_VALUE}>Any</SelectItem>
                  {experienceLevels.map((experienceLevel) => (
                    <SelectItem key={experienceLevel} value={experienceLevel}>
                      {formatExperienceLevel(experienceLevel)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="jobType"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Type</FormLabel>
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ANY_VALUE}>Any</SelectItem>
                  {jobListingTypes.map((jobListingType) => (
                    <SelectItem key={jobListingType} value={jobListingType}>
                      {formatJobListingType(jobListingType)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="w-full"
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Filter
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};

export default JobListingFilterForm;
