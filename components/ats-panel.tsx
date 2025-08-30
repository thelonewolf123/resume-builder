import { computeResumeAtsMetrics } from "@/lib/utils/resume";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export default function ATSPanel({
  resumeText,
  jobDescription
}: {
  resumeText: string;
  jobDescription: string;
}) {
  const metrics = React.useMemo(
    () => computeResumeAtsMetrics(resumeText, jobDescription),
    [resumeText, jobDescription]
  );
  return (
    <Card className="sticky top-4 print:hidden shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Live Resume Feedback</CardTitle>
        <Badge variant="secondary">Beta</Badge>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <div className="text-sm text-muted-foreground">Readability</div>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-2 w-full rounded bg-muted">
              <div
                className="h-2 rounded bg-blue-600"
                style={{ width: `${metrics.readability * 100}%` }}
              />
            </div>
            <span className="w-10 text-right text-xs tabular-nums">
              {(metrics.readability * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat label="Words" value={metrics.wordCount.toString()} />
          <Stat label="Sections filled" value={`${metrics.sectionsFilled}/6`} />
        </div>

        <div className="grid gap-2">
          <div className="text-sm font-medium">ATS Keywords</div>
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
          ) : (
            <p className="text-sm text-muted-foreground">
              Provide a job description via “Build with AI” to see keyword
              coverage.
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

// ATS Panel

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-medium">{value}</div>
    </div>
  );
}
