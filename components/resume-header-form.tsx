"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import type { ResumeData } from "@/lib/schemas/resume";

interface ResumeHeaderFormProps {
  onLinksUpdate: (links: {
    website: string;
    github: string;
    linkedin: string;
  }) => void;
}

export function ResumeHeaderForm({ onLinksUpdate }: ResumeHeaderFormProps) {
  const form = useFormContext<ResumeData>();

  return (
    <Card id="builder" className="print:hidden shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Contact & Header</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {/* Profile image upload + preview */}
        <div className="md:col-span-2 flex items-center gap-4">
          {/* Placeholder for Avatar component */}
          <div className="h-16 w-16 bg-gray-300 rounded-full"></div>
          <div className="grid gap-2">
            <Label htmlFor="photo">Profile photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const url = String(reader.result || "");
                  form.setValue("photoUrl", url, {
                    shouldValidate: true,
                    shouldDirty: true
                  });
                };
                reader.readAsDataURL(file);
              }}
            />
            <p className="text-muted-foreground text-xs">
              Upload a square image for best results.
            </p>
          </div>
        </div>

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact.location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact.website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://your-site.com"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    onLinksUpdate({
                      website: e.target.value,
                      github: form.getValues("contact.github") || "",
                      linkedin: form.getValues("contact.linkedin") || ""
                    });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact.github"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://github.com/you"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    onLinksUpdate({
                      website: form.getValues("contact.website") || "",
                      github: e.target.value,
                      linkedin: form.getValues("contact.linkedin") || ""
                    });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact.linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://linkedin.com/in/you"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    onLinksUpdate({
                      website: form.getValues("contact.website") || "",
                      github: form.getValues("contact.github") || "",
                      linkedin: e.target.value
                    });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
