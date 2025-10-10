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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { newJobListingApplicationSchema } from "../../jobListings/actions/schema";
import { createJobListingApplication } from "../actions/actions";

const NewJobListingApplicationForm = ({
  jobListingId,
}: {
  jobListingId: string;
}) => {
  const form = useForm({
    defaultValues: {
      coverLetter: "",
    },
    resolver: zodResolver(newJobListingApplicationSchema),
  });

  const handleSubmit = async (
    data: z.infer<typeof newJobListingApplicationSchema>,
  ) => {
    const result = await createJobListingApplication(jobListingId, data);

    if (result.error) {
      return toast.error(result.message);
    }

    toast.success(result.message);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          name="coverLetter"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter</FormLabel>
              <FormControl>
                <MarkdownEditor {...field} markdown={field.value ?? ""} />
              </FormControl>
              <FormDescription>Optional</FormDescription>
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
            Apply
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};

export default NewJobListingApplicationForm;
