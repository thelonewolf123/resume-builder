"use client";

import { Button } from "@/components/ui/button";
import { AIResumeDialog } from "@/components/ai-resume-dialog";
import { ExportControls } from "@/components/export-controls";
import type { ResumeData, SectionId } from "@/lib/schemas/resume";

interface ResumeBuilderHeaderProps {
  isValid: boolean;
  data: ResumeData;
  order: SectionId[];
  jobDescription: string;
  links: {
    website: string;
    github: string;
    linkedin: string;
  };
  onLoadDemo: () => void;
  onGenerate: (
    jobDescription: string,
    links: {
      website: string;
      github: string;
      linkedin: string;
    }
  ) => void;
}

export function ResumeBuilderHeader({
  isValid,
  data,
  order,
  jobDescription,
  links,
  onLoadDemo,
  onGenerate
}: ResumeBuilderHeaderProps) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-pretty text-2xl font-semibold tracking-tight md:text-3xl">
          Resume Builder
        </h1>
        <p className="text-muted-foreground">
          Clean, professional resumes with live feedback and drag-and-drop
          sections.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={onLoadDemo} type="button">
          Load Demo
        </Button>
        <AIResumeDialog
          jobDescription={jobDescription}
          links={links}
          onGenerate={onGenerate}
        />
        <ExportControls isValid={isValid} data={data} order={order} />
      </div>
    </header>
  );
}
