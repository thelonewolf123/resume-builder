"use client";

import type { SectionId } from "@/lib/schemas/resume";
import { SummaryEditor } from "./summary-editor";
import { SkillsEditor } from "./skills-editor";
import { ExperienceEditor } from "./experience-editor";
import { EducationEditor } from "./education-editor";
import { ProjectsEditor } from "./projects-editor";

interface SectionEditorProps {
  id: SectionId;
}

export function SectionEditor({ id }: SectionEditorProps) {
  switch (id) {
    case "summary":
      return <SummaryEditor />;
    case "skills":
      return <SkillsEditor />;
    case "experience":
      return <ExperienceEditor />;
    case "education":
      return <EducationEditor />;
    case "projects":
      return <ProjectsEditor />;
    default:
      return null;
  }
}
