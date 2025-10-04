"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import LoadingSwap from "@/components/LoadingSwap";
import { MarkdownEditor } from "@/components/markdown/MarkdownEditor";
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
  experienceLevels,
  JobListingTable,
  jobListingTypes,
  locationRequirements,
  wageIntervals,
} from "@/drizzle/schema";

import { createJobListing, updateJobListing } from "../actions/actions";
import { jobListingSchema } from "../actions/schema";
import {
  formatExperienceLevel,
  formatJobListingType,
  formatLocationRequirement,
  formatWageInterval,
} from "../lib/formatters";
import StateSelectItems from "./StateSelectItems";

const NONE_SELECT_VALUE = "none";

const JobListingForm = ({
  jobListing,
}: {
  jobListing?: Pick<
    typeof JobListingTable.$inferSelect,
    | "id"
    | "title"
    | "description"
    | "wage"
    | "wageInterval"
    | "city"
    | "stateAbbreviation"
    | "locationRequirement"
    | "type"
    | "experienceLevel"
  >;
}) => {
  const form = useForm({
    defaultValues: jobListing ?? {
      city: null,
      description: "",
      experienceLevel: "junior",
      locationRequirement: "in-office",
      stateAbbreviation: null,
      title: "",
      type: "full-time",
      wage: null,
      wageInterval: "yearly",
    },
    resolver: zodResolver(jobListingSchema),
  });

  const handleSubmit = async (data: z.infer<typeof jobListingSchema>) => {
    const action = jobListing ? updateJobListing.bind(null, jobListing.id) : createJobListing;
    const res = await action(data);

    if (res.error) {
      toast.error(res.message);
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-6 @container"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="grid grid-cols-1 @md:grid-cols-2 gap-x-4 gap-y-6 items-start">
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Job Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="wage"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wage</FormLabel>
                <div className="flex">
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      value={field.value ?? ""}
                      className="rounded-r-none"
                      onChange={(e) => {
                        field.onChange(
                          isNaN(e.target.valueAsNumber)
                            ? null
                            : e.target.valueAsNumber,
                        );
                      }}
                    />
                  </FormControl>
                  <FormField
                    name="wageInterval"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={field.value ?? ""}
                            onValueChange={(val) =>
                              field.onChange(
                                val === NONE_SELECT_VALUE ? null : val,
                              )
                            }
                          >
                            <SelectTrigger className="rounded-l-none">
                              / <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {field.value && (
                                <SelectItem
                                  value={NONE_SELECT_VALUE}
                                  className="text-muted-foreground"
                                >
                                  Clear
                                </SelectItem>
                              )}
                              {wageIntervals.map((interval) => (
                                <SelectItem key={interval} value={interval}>
                                  {formatWageInterval(interval)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 @md:grid-cols-2 gap-x-4 gap-y-6 items-start">
          <div className="grid grid-cols-1 @xs:grid-cols-2 gap-x-4 gap-y-6 items-start">
            <FormField
              name="city"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="stateAbbreviation"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(val) =>
                      field.onChange(val === NONE_SELECT_VALUE ? null : val)
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {field.value && (
                        <SelectItem
                          value={NONE_SELECT_VALUE}
                          className="text-muted-foreground"
                        >
                          Clear
                        </SelectItem>
                      )}
                      <StateSelectItems />
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="locationRequirement"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Location Requirement <span className="text-red-500">*</span>
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
        </div>
        <div className="grid grid-cols-1 @md:grid-cols-2 gap-x-4 gap-y-6 items-start">
          <FormField
            name="type"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Job Type <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
          <FormField
            name="experienceLevel"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Experience Level <span className="text-red-500">*</span>
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
        </div>
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <MarkdownEditor {...field} markdown={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="w-full"
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            {jobListing ? "Update" : "Create"} Job Listing
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};

export default JobListingForm;
