"use client";

import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ResumeData, SectionId } from "@/lib/schemas/resume";

interface ExportControlsProps {
  isValid: boolean;
  data: ResumeData;
  order: SectionId[];
}

export function ExportControls({ isValid, data, order }: ExportControlsProps) {
  const router = useRouter();

  const handleExport = () => {
    // Save resume data to localStorage
    localStorage.setItem("resumeData", JSON.stringify(data));
    localStorage.setItem("resumeOrder", JSON.stringify(order));

    router.push("/preview");
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" disabled={!isValid} onClick={handleExport}>
        <FileText className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
    </div>
  );
}
