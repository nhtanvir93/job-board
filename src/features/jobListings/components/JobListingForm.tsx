"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

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
import { locationRequirements, wageIntervals } from "@/drizzle/schema";

import { jobListingSchema } from "../actions/schema";
import {
  formatLocationRequirement,
  formatWageInterval,
} from "../lib/formatters";
import StateSelectItems from "./StateSelectItems";

const NONE_SELECT_VALUE = "none";

const JobListingForm = () => {
  const form = useForm({
    defaultValues: {
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

  const handleSubmit = (data: z.infer<typeof jobListingSchema>) => {
    console.log(data);
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
                <FormLabel>Job Title</FormLabel>
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
                  <FormControl>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(val) =>
                        field.onChange(val === NONE_SELECT_VALUE ? null : val)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
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
                        <StateSelectItems />
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="locationRequirement"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Requirement</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default JobListingForm;
