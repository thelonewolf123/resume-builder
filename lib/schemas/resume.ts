import { z } from "zod";

export const phoneRegex = /^\+?[0-9().\-\s]{7,}$/;

export const experienceItemSchema = z.object({
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  period: z.string().min(1, "Period is required"),
  details: z.array(z.string().min(1)).default([]).optional()
});

export const educationItemSchema = z.object({
  school: z.string().min(1, "School is required"),
  degree: z.string().min(1, "Degree is required"),
  period: z.string().min(1, "Period is required")
});

export const projectItemSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  link: z
    .string()
    .url("Project link must be a valid URL")
    .optional()
    .or(z.literal("")),
  description: z.string().min(1, "Project description is required"),
  highlights: z.array(z.string().min(1)).default([])
});

export const contactSchema = z.object({
  email: z.string().email("Enter a valid email"),
  phone: z.string().regex(phoneRegex, "Enter a valid phone number"),
  location: z.string().min(1, "Location is required"),
  website: z
    .string()
    .url("Website must be a valid URL")
    .optional()
    .or(z.literal("")),
  github: z
    .string()
    .url("GitHub must be a valid URL")
    .optional()
    .or(z.literal("")),
  linkedin: z
    .string()
    .url("LinkedIn must be a valid URL")
    .optional()
    .or(z.literal(""))
});

export const layoutSchema = z.enum([
  "classic",
  "modern",
  "minimal",
  "two-column",
  "compact"
]);

export const resumeSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  title: z.string().min(1, "Title is required"),
  contact: contactSchema,
  summary: z.string().optional(),
  experience: z.array(experienceItemSchema).default([]),
  education: z.array(educationItemSchema).default([]),
  skills: z.array(z.string().min(1)).default([]),
  projects: z.array(projectItemSchema).default([]),
  photoUrl: z.string().url().optional(),
  layout: layoutSchema.default("classic"),
  activeSections: z
    .array(z.enum(["summary", "experience", "education", "skills", "projects"]))
    .default(["summary", "experience", "education", "skills", "projects"])
});

export type SectionId =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects";
export type LayoutType = z.infer<typeof layoutSchema>;
export type ResumeData = z.infer<typeof resumeSchema>;
