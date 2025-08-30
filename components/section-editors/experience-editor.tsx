"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import type { ResumeData } from "@/lib/schemas/resume";

export function ExperienceEditor() {
  const form = useFormContext<ResumeData>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experience"
  });

  return (
    <div className="grid gap-6">
      {fields.map((f, idx) => (
        <div key={f.id} className="grid gap-3 rounded-md border p-3">
          <div className="grid gap-2 md:grid-cols-3">
            <FormField
              control={form.control}
              name={`experience.${idx}.role`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`experience.${idx}.company`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`experience.${idx}.period`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Period</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name={`experience.${idx}.details`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Highlights (one per line)</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    value={(field.value || []).join("\n")}
                    onChange={(e) => {
                      const next = e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      form.setValue(`experience.${idx}.details`, next, {
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
          <div className="flex justify-end">
            <Button variant="ghost" type="button" onClick={() => remove(idx)}>
              Remove
            </Button>
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <Button
          variant="secondary"
          type="button"
          onClick={() =>
            append({
              role: "Software Engineer",
              company: "New Company",
              period: "YYYY — YYYY",
              details: ["Impactful achievement"]
            })
          }
        >
          Add Experience
        </Button>
      </div>
    </div>
  );
}
