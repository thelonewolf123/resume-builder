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

export function ProjectsEditor() {
  const form = useFormContext<ResumeData>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "projects"
  });

  return (
    <div className="grid gap-6">
      {fields.map((f, idx) => (
        <div key={f.id} className="grid gap-3 rounded-md border p-3">
          <div className="grid gap-2 md:grid-cols-3">
            <FormField
              control={form.control}
              name={`projects.${idx}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`projects.${idx}.link`}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name={`projects.${idx}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`projects.${idx}.highlights`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Highlights (one per line)</FormLabel>
                <FormControl>
                  <Textarea
                    rows={2}
                    value={(field.value || []).join("\n")}
                    onChange={(e) => {
                      const next = e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      form.setValue(`projects.${idx}.highlights`, next, {
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
              name: "New Project",
              link: "",
              description: "What it does...",
              highlights: ["Key impact"]
            })
          }
        >
          Add Project
        </Button>
      </div>
    </div>
  );
}
