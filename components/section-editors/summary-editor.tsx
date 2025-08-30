"use client";

import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import type { ResumeData } from "@/lib/schemas/resume";

export function SummaryEditor() {
  const form = useFormContext<ResumeData>();

  return (
    <FormField
      control={form.control}
      name="summary"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Professional Summary</FormLabel>
          <FormControl>
            <Textarea rows={4} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
