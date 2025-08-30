import { computeResumeAtsMetrics } from "@/lib/utils/resume";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

import type { ResumeData } from "@/lib/schemas/resume";

export default function ATSPanel({
  resumeText,
  jobDescription,
  data
}: {
  resumeText: string;
  jobDescription: string;
  data?: ResumeData;
}) {
  const metrics = React.useMemo(
    () => computeResumeAtsMetrics(resumeText, jobDescription, data),
    [resumeText, jobDescription, data]
  );

  return (
    <Card className="sticky top-4 print:hidden shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Live Resume Feedback</CardTitle>
        <Badge variant="secondary">Beta</Badge>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Overall ATS Score */}
        <div>
          <div className="text-sm text-muted-foreground">ATS Score</div>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-3 w-full rounded bg-muted">
              <div
                className={`h-3 rounded transition-all ${
                  metrics.score >= 80
                    ? "bg-green-600"
                    : metrics.score >= 60
                    ? "bg-yellow-600"
                    : "bg-red-600"
                }`}
                style={{ width: `${metrics.score}%` }}
              />
            </div>
            <span className="w-12 text-right text-sm font-medium tabular-nums">
              {metrics.score}%
            </span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Words" value={metrics.wordCount.toString()} />
          <Stat
            label="Sections"
            value={`${metrics.sectionsFilled}/${metrics.activeSectionCount}`}
          />
          <Stat
            label="Keywords"
            value={`${metrics.keywordMatchRate}%`}
            status={
              metrics.keywordMatchRate >= 40
                ? "good"
                : metrics.keywordMatchRate >= 20
                ? "warning"
                : "poor"
            }
          />
          <Stat
            label="Contact Info"
            value={`${metrics.contactCompleteness}%`}
            status={metrics.contactCompleteness >= 80 ? "good" : "warning"}
          />
        </div>

        {/* Advanced Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <MetricBadge
            label="Achievements"
            value={`${metrics.quantifiableAchievements}%`}
            status={metrics.quantifiableAchievements >= 50 ? "good" : "warning"}
          />
          <MetricBadge
            label="Industry Terms"
            value={`${metrics.industryTerms}%`}
            status={metrics.industryTerms >= 60 ? "good" : "warning"}
          />
          <MetricBadge
            label="Readability"
            value={`${Math.round(metrics.readability * 100)}%`}
            status={
              metrics.readability >= 0.7
                ? "good"
                : metrics.readability >= 0.5
                ? "warning"
                : "poor"
            }
          />
        </div>

        <div className="grid gap-2">
          <div className="text-sm font-medium">
            {jobDescription ? "ATS Keywords" : "Industry Terms Found"}
          </div>
          {jobDescription ? (
            <div className="flex flex-wrap gap-2">
              {metrics.presentKeywords.slice(0, 10).map((k) => (
                <Badge
                  key={k}
                  variant="outline"
                  className="border-blue-600/30 text-blue-700"
                >
                  {k}
                </Badge>
              ))}
              {metrics.missingKeywords.slice(0, 10).map((k) => (
                <Badge
                  key={k}
                  variant="outline"
                  className="border-muted-foreground/30 text-muted-foreground"
                >
                  {k}
                </Badge>
              ))}
            </div>
          ) : metrics.presentKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {metrics.presentKeywords.map((k) => (
                <Badge
                  key={k}
                  variant="outline"
                  className="border-green-600/30 text-green-700"
                >
                  {k}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Add more technical skills and industry terms to your resume.
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <div className="text-sm font-medium">Suggestions</div>
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            {metrics.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// ATS Panel Components

function Stat({
  label,
  value,
  status
}: {
  label: string;
  value: string;
  status?: "good" | "warning" | "poor";
}) {
  const getStatusColor = () => {
    switch (status) {
      case "good":
        return "border-green-200 bg-green-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      case "poor":
        return "border-red-200 bg-red-50";
      default:
        return "border-border bg-background";
    }
  };

  return (
    <div className={`rounded-md border p-3 ${getStatusColor()}`}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-medium">{value}</div>
    </div>
  );
}

function MetricBadge({
  label,
  value,
  status
}: {
  label: string;
  value: string;
  status: "good" | "warning" | "poor";
}) {
  const getStatusStyle = () => {
    switch (status) {
      case "good":
        return "border-green-600/30 text-green-700 bg-green-50";
      case "warning":
        return "border-yellow-600/30 text-yellow-700 bg-yellow-50";
      case "poor":
        return "border-red-600/30 text-red-700 bg-red-50";
    }
  };

  return (
    <div className={`rounded-md border p-2 text-center ${getStatusStyle()}`}>
      <div className="text-xs font-medium">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}
