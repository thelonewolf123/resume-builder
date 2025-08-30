import { z } from "zod";

export const phoneRegex = /^\+?[0-9().\-\s]{7,}$/;

export const experienceItemSchema = z.object({
  role: z
    .string()
    .min(1, "Role is required")
    .describe("Job title or position held at the company"),
  company: z
    .string()
    .min(1, "Company is required")
    .describe("Name of the company or organization"),
  period: z
    .string()
    .min(1, "Period is required")
    .describe("Employment duration (e.g., 'Jan 2020 - Present', '2019-2021')"),
  details: z
    .array(z.string().min(1))
    .default([])
    .optional()
    .describe(
      "List of key achievements, responsibilities, and accomplishments in bullet point format"
    )
});

export const educationItemSchema = z.object({
  school: z
    .string()
    .min(1, "School is required")
    .describe(
      "Name of the educational institution (university, college, school)"
    ),
  degree: z
    .string()
    .min(1, "Degree is required")
    .describe(
      "Academic degree, certification, or program completed (e.g., 'Bachelor of Science in Computer Science', 'High School Diploma')"
    ),
  period: z
    .string()
    .min(1, "Period is required")
    .describe(
      "Duration of study or graduation year (e.g., '2018-2022', 'Graduated 2020')"
    )
});

export const projectItemSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .describe("Title or name of the project"),
  link: z
    .string()
    .url("Project link must be a valid URL")
    .optional()
    .or(z.literal(""))
    .describe(
      "URL link to the project (GitHub repository, live demo, or project website)"
    ),
  description: z
    .string()
    .min(1, "Project description is required")
    .describe("Brief overview of what the project does and its main purpose"),
  highlights: z
    .array(z.string().min(1))
    .default([])
    .describe(
      "Key technical achievements, technologies used, or notable features of the project"
    )
});

export const contactSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email")
    .describe("Professional email address for contact"),
  phone: z
    .string()
    .regex(phoneRegex, "Enter a valid phone number")
    .describe("Phone number with country code (e.g., '+1 (555) 123-4567')"),
  location: z
    .string()
    .min(1, "Location is required")
    .describe(
      "Current city and state/country (e.g., 'San Francisco, CA' or 'New York, NY')"
    ),
  website: z
    .string()
    .url("Website must be a valid URL")
    .optional()
    .or(z.literal(""))
    .describe("Personal portfolio website or professional homepage URL"),
  github: z
    .string()
    .url("GitHub must be a valid URL")
    .optional()
    .or(z.literal(""))
    .describe(
      "GitHub profile URL showcasing code repositories and contributions"
    ),
  linkedin: z
    .string()
    .url("LinkedIn must be a valid URL")
    .optional()
    .or(z.literal(""))
    .describe("LinkedIn profile URL for professional networking")
});

export const layoutSchema = z
  .enum(["classic", "modern", "minimal", "two-column", "compact"])
  .describe(
    "Visual layout style for the resume (classic: traditional format, modern: contemporary design, minimal: clean simple layout, two-column: sidebar layout, compact: space-efficient format)"
  );

export const resumeSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .describe("Full legal name of the person (first and last name)"),
  title: z
    .string()
    .min(1, "Title is required")
    .describe(
      "Professional title or desired job position (e.g., 'Software Engineer', 'Marketing Manager')"
    ),
  contact: contactSchema.describe(
    "Contact information including email, phone, location, and social profiles"
  ),
  summary: z
    .string()
    .optional()
    .describe(
      "Professional summary or objective statement highlighting key qualifications and career goals"
    ),
  experience: z
    .array(experienceItemSchema)
    .default([])
    .describe(
      "Work experience history with roles, companies, and achievements"
    ),
  education: z
    .array(educationItemSchema)
    .default([])
    .describe(
      "Educational background including degrees, institutions, and graduation dates"
    ),
  skills: z
    .array(z.string().min(1))
    .default([])
    .describe(
      "Technical and professional skills relevant to the desired position"
    ),
  projects: z
    .array(projectItemSchema)
    .default([])
    .describe(
      "Personal or professional projects showcasing abilities and experience"
    ),
  photoUrl: z
    .string()
    .url()
    .optional()
    .describe("Optional profile photo URL for the resume header"),
  layout: layoutSchema
    .default("classic")
    .describe("Resume layout and visual styling preference"),
  activeSections: z
    .array(z.enum(["summary", "experience", "education", "skills", "projects"]))
    .default(["summary", "experience", "education", "skills", "projects"])
    .describe(
      "List of resume sections to include and display on the final resume"
    )
});

export type SectionId =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects";
export type LayoutType = z.infer<typeof layoutSchema>;
export type ResumeData = z.infer<typeof resumeSchema>;
