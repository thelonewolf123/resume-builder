"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import ExternalResumePreview from "@/components/resume-preview";
import {
  resumeSchema,
  type ResumeData,
  type SectionId,
  type LayoutType
} from "@/lib/schemas/resume";
import {
  emptyResume,
  demoResume,
  composeResumePlainText
} from "@/lib/utils/resume";
import ATSPanel from "./ats-panel";
import { ResumeBuilderHeader } from "./resume-builder-header";
import { ResumeHeaderForm } from "./resume-header-form";
import { LayoutSelector } from "./layout-selector";
import { SortableSection } from "./sortable-section";
import { SectionEditor } from "./section-editors/section-editor";

const defaultOrder: SectionId[] = [
  "summary",
  "experience",
  "projects",
  "skills",
  "education"
];

export function ResumeBuilder() {
  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema) as Resolver<ResumeData>,
    defaultValues: emptyResume,
    mode: "onChange"
  });
  const data = form.watch();

  const activeSections = data.activeSections || defaultOrder;
  const [order, setOrder] = React.useState<SectionId[]>(activeSections);

  // Sync order with activeSections when activeSections changes
  React.useEffect(() => {
    setOrder(activeSections);
  }, [activeSections]);

  const [jobDescription, setJobDescription] = React.useState("");
  const [links, setLinks] = React.useState({
    website: "",
    github: "",
    linkedin: ""
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = order.indexOf(active.id as SectionId);
    const newIndex = order.indexOf(over.id as SectionId);

    if (oldIndex !== -1 && newIndex !== -1) {
      setOrder((items) => arrayMove(items, oldIndex, newIndex));
    }
  }

  const isValid = form.formState.isValid;

  const resumePlainText = React.useMemo(
    () => composeResumePlainText(form.getValues(), order),
    [form, order]
  );

  function onLinksUpdate(next: {
    website: string;
    github: string;
    linkedin: string;
  }) {
    setLinks(next);
    form.setValue("contact.website", next.website || "", {
      shouldValidate: true,
      shouldDirty: true
    });
    form.setValue("contact.github", next.github || "", {
      shouldValidate: true,
      shouldDirty: true
    });
    form.setValue("contact.linkedin", next.linkedin || "", {
      shouldValidate: true,
      shouldDirty: true
    });
  }

  function loadDemo() {
    form.reset(demoResume, { keepDefaultValues: false });
    onLinksUpdate({
      website: demoResume.contact.website || "",
      github: demoResume.contact.github || "",
      linkedin: demoResume.contact.linkedin || ""
    });
    setOrder(demoResume.activeSections);
  }

  function removeSection(sectionId: SectionId) {
    const newActiveSections = activeSections.filter((id) => id !== sectionId);
    const newOrder = order.filter((id) => id !== sectionId);

    form.setValue("activeSections", newActiveSections, {
      shouldValidate: true,
      shouldDirty: true
    });
    setOrder(newOrder);
  }

  function addSection(sectionId: SectionId) {
    if (!activeSections.includes(sectionId)) {
      const newActiveSections = [...activeSections, sectionId];
      const newOrder = [...order, sectionId];

      form.setValue("activeSections", newActiveSections, {
        shouldValidate: true,
        shouldDirty: true
      });
      setOrder(newOrder);
    }
  }

  function updateLayout(layout: LayoutType) {
    form.setValue("layout", layout, {
      shouldValidate: true,
      shouldDirty: true
    });
  }

  const availableSections = defaultOrder.filter(
    (id) => !activeSections.includes(id)
  );

  return (
    <Form {...form}>
      <form
        className="mx-auto max-w-6xl px-4 py-8"
        onSubmit={(e) => e.preventDefault()}
      >
        <ResumeBuilderHeader
          isValid={isValid}
          data={data}
          order={order}
          jobDescription={jobDescription}
          links={links}
          onLoadDemo={loadDemo}
          onGenerate={(jd, lks) => {
            setJobDescription(jd);
            onLinksUpdate(lks);
          }}
        />

        <LayoutSelector
          currentLayout={data.layout || "classic"}
          activeSections={activeSections}
          availableSections={availableSections}
          onLayoutChange={updateLayout}
          onAddSection={addSection}
        />

        <Separator className="my-6" />

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 flex flex-col gap-6">
            <ResumeHeaderForm onLinksUpdate={onLinksUpdate} />

            <Card className="print:hidden shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  Drag to rearrange sections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={order}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="grid gap-4">
                      {order
                        .filter((id) => activeSections.includes(id))
                        .map((id) => (
                          <SortableSection
                            key={id}
                            id={id}
                            onRemove={() => removeSection(id)}
                          >
                            <SectionEditor id={id} />
                          </SortableSection>
                        ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </CardContent>
            </Card>

            <Card
              id="preview"
              className="border-blue-600/20 shadow-sm print:border-0"
            >
              <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
              </CardHeader>
              <CardContent data-pdf-root>
                <ExternalResumePreview
                  order={order}
                  data={data}
                  className="mx-auto max-w-3xl bg-white p-6 text-sm leading-relaxed text-foreground md:p-8 print:bg-white print:p-0"
                />
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <ATSPanel
              resumeText={resumePlainText}
              jobDescription={jobDescription}
              data={data}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
