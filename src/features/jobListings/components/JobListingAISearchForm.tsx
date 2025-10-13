"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import LoadingSwap from "@/components/LoadingSwap";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { getAIJobListingSearchResults } from "../actions/actions";
import { jobListingAISearchSchema } from "../actions/schema";

const JobListingAISearchForm = () => {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      query: "",
    },
    resolver: zodResolver(jobListingAISearchSchema),
  });

  async function handleSubmit(data: z.infer<typeof jobListingAISearchSchema>) {
    const result = await getAIJobListingSearchResults(data);

    if (result.error) {
      return toast.error(result.message);
    }

    const params = new URLSearchParams();
    result.jobIds.forEach((jobId) => params.append("jobIds", jobId));
    router.push(`/?${params.toString()}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          name="query"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Query</FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-32" />
              </FormControl>
              <FormDescription>
                Provide a description of your skills/experience as well as what
                you are looking for in a job. The more specific you are, the
                better the results will be.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={form.formState.isSubmitting} className="w-full">
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Search
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};

export default JobListingAISearchForm;
