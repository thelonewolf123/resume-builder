"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Layout, Plus } from "lucide-react";
import type { LayoutType, SectionId } from "@/lib/schemas/resume";

interface LayoutSelectorProps {
  currentLayout: LayoutType;
  activeSections: SectionId[];
  availableSections: SectionId[];
  onLayoutChange: (layout: LayoutType) => void;
  onAddSection: (sectionId: SectionId) => void;
}

const layouts = [
  {
    id: "classic" as LayoutType,
    name: "Classic",
    desc: "Traditional single-column format"
  },
  {
    id: "modern" as LayoutType,
    name: "Modern",
    desc: "Clean with subtle colors and cards"
  },
  {
    id: "minimal" as LayoutType,
    name: "Minimal",
    desc: "Simple with left borders"
  },
  {
    id: "two-column" as LayoutType,
    name: "Two Column",
    desc: "Skills & summary on left, experience on right"
  },
  {
    id: "compact" as LayoutType,
    name: "Compact",
    desc: "Space-efficient design"
  }
];

export function LayoutSelector({
  currentLayout,
  activeSections,
  availableSections,
  onLayoutChange,
  onAddSection
}: LayoutSelectorProps) {
  // Suppress unused variable warning - activeSections may be used in future iterations
  void activeSections;
  return (
    <Card className="print:hidden shadow-sm mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Layout className="h-5 w-5" />
          Layout & Sections
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Layout Selector */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Choose Layout
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {layouts.map((layout) => (
              <div
                key={layout.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  currentLayout === layout.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => onLayoutChange(layout.id)}
              >
                <div className="font-medium text-sm mb-1">{layout.name}</div>
                <div className="text-xs text-gray-600">{layout.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Section Controls */}
        {availableSections.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Add Sections
            </Label>
            <div className="flex flex-wrap gap-2">
              {availableSections.map((sectionId) => (
                <Button
                  key={sectionId}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onAddSection(sectionId)}
                  className="capitalize"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {sectionId}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
