"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import type { ResumeData } from "@/lib/schemas/resume";

export function EducationEditor() {
  const form = useFormContext<ResumeData>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education"
  });

  return (
    <div className="grid gap-6">
      {fields.map((f, idx) => (
        <div
          key={f.id}
          className="grid gap-3 rounded-md border p-3 md:grid-cols-3"
        >
          <FormField
            control={form.control}
            name={`education.${idx}.school`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>School</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`education.${idx}.degree`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Degree</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`education.${idx}.period`}
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
          <div className="md:col-span-3 flex justify-end">
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
              school: "New School",
              degree: "Degree",
              period: "YYYY — YYYY"
            })
          }
        >
          Add Education
        </Button>
      </div>
    </div>
  );
}
