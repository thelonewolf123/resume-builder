"use client";

import { useEffect, useState } from "react";
import ResumePreview from "@/components/resume-preview";
import type { ResumeData, SectionId } from "@/lib/schemas/resume";
import { emptyResume } from "@/lib/utils/resume";

export default function PreviewPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResume);
  const [order, setOrder] = useState<SectionId[]>([
    "summary",
    "experience",
    "projects",
    "skills",
    "education"
  ]);

  useEffect(() => {
    // Load resume data from localStorage
    const savedData = localStorage.getItem("resumeData");
    const savedOrder = localStorage.getItem("resumeOrder");

    if (savedData) {
      try {
        setResumeData(JSON.parse(savedData));
      } catch (error) {
        console.error("Error parsing resume data:", error);
      }
    }

    if (savedOrder) {
      try {
        setOrder(JSON.parse(savedOrder));
      } catch (error) {
        console.error("Error parsing resume order:", error);
      }
    }
  }, []);

  return (
    <div className="a4-container">
      <div className="a4-sheet">
        <ResumePreview data={resumeData} order={order} />
      </div>
    </div>
  );
}
