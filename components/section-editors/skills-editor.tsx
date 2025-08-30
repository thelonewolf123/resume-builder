"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import type { ResumeData } from "@/lib/schemas/resume";

export function SkillsEditor() {
  const form = useFormContext<ResumeData>();

  return (
    <FormField
      control={form.control}
      name="skills"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Skills (comma-separated)</FormLabel>
          <FormControl>
            <Input
              value={(field.value || []).join(", ")}
              onChange={(e) => {
                const next = e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
                form.setValue("skills", next, {
                  shouldValidate: true,
                  shouldDirty: true
                });
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
