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
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import { GripVertical, FileText } from "lucide-react";
import {
  useForm,
  useFieldArray,
  useFormContext,
  Resolver
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import ExternalResumePreview from "@/components/resume-preview";
import {
  resumeSchema,
  type ResumeData,
  type SectionId
} from "@/lib/schemas/resume";
import {
  emptyResume,
  demoResume,
  composeResumePlainText
} from "@/lib/utils/resume";
import { AIResumeDialog } from "@/components/ai-resume-dialog";
import { useRouter } from "next/navigation";
import ATSPanel from "./ats-panel";

const defaultOrder: SectionId[] = [
  "summary",
  "experience",
  "projects",
  "skills",
  "education"
];

export function ResumeBuilder() {
  const [order, setOrder] = React.useState<SectionId[]>(defaultOrder);
  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema) as Resolver<ResumeData>,
    defaultValues: emptyResume,
    mode: "onChange"
  });
  const data = form.watch();

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
    setOrder((items) => arrayMove(items, oldIndex, newIndex));
  }

  const isValid = form.formState.isValid;

  const resumePlainText = React.useMemo(
    () => composeResumePlainText(form.getValues()),
    [form]
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
  }

  return (
    <Form {...form}>
      <form
        className="mx-auto max-w-6xl px-4 py-8"
        onSubmit={(e) => e.preventDefault()}
      >
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
            <Button variant="secondary" onClick={loadDemo} type="button">
              Load Demo
            </Button>
            <AIResumeDialog
              jobDescription={jobDescription}
              links={links}
              onGenerate={(jd, lks) => {
                setJobDescription(jd);
                onLinksUpdate(lks);
              }}
            />
            <ExportControls isValid={isValid} data={data} order={order} />
          </div>
        </header>

        <Separator className="my-6" />

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 flex flex-col gap-6">
            <Card id="builder" className="print:hidden shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Contact & Header</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {/* Profile image upload + preview */}
                <div className="md:col-span-2 flex items-center gap-4">
                  {/* Placeholder for Avatar component */}
                  <div className="h-16 w-16 bg-gray-300 rounded-full"></div>
                  <div className="grid gap-2">
                    <Label htmlFor="photo">Profile photo</Label>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          const url = String(reader.result || "");
                          form.setValue("photoUrl", url, {
                            shouldValidate: true,
                            shouldDirty: true
                          });
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    <p className="text-muted-foreground text-xs">
                      Upload a square image for best results.
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact.location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact.website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://your-site.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact.github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://github.com/you"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact.linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/in/you"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

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
                      {order.map((id) => (
                        <SortableSection key={id} id={id}>
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
            />
          </div>
        </div>
      </form>
    </Form>
  );
}

function SortableSection({
  id,
  children
}: {
  id: SectionId;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const titles: Record<SectionId, string> = {
    summary: "Summary",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects"
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-80" : ""}
    >
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">{titles[id]}</CardTitle>
          <button
            aria-label={`Drag ${titles[id]}`}
            className="inline-flex items-center rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}

// Editors

function SectionEditor({ id }: { id: SectionId }) {
  const form = useFormContext<ResumeData>();

  // Always declare hooks in a consistent order; select based on the section id.
  const expFA = useFieldArray({ control: form.control, name: "experience" });
  const eduFA = useFieldArray({ control: form.control, name: "education" });
  const projFA = useFieldArray({ control: form.control, name: "projects" });

  if (id === "summary") {
    return (
      <FormField
        control={form.control}
        name="summary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Summary</FormLabel>
            <FormControl>
              <Textarea rows={4} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (id === "skills") {
    return (
      <FormField
        control={form.control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Skills (comma-separated)</FormLabel>
            <FormControl>
              <Input
                value={(field.value || []).join(", ")}
                onChange={(e) => {
                  const next = e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  form.setValue("skills", next, {
                    shouldValidate: true,
                    shouldDirty: true
                  });
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (id === "experience") {
    const { fields, append, remove } = expFA;
    return (
      <div className="grid gap-6">
        {fields.map((f, idx) => (
          <div key={f.id} className="grid gap-3 rounded-md border p-3">
            <div className="grid gap-2 md:grid-cols-3">
              <FormField
                control={form.control}
                name={`experience.${idx}.role`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`experience.${idx}.company`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`experience.${idx}.period`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Period</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name={`experience.${idx}.details`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Highlights (one per line)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      value={(field.value || []).join("\n")}
                      onChange={(e) => {
                        const next = e.target.value
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        form.setValue(`experience.${idx}.details`, next, {
                          shouldValidate: true,
                          shouldDirty: true
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button variant="ghost" type="button" onClick={() => remove(idx)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <Button
            variant="secondary"
            type="button"
            onClick={() =>
              append({
                role: "Software Engineer",
                company: "New Company",
                period: "YYYY — YYYY",
                details: ["Impactful achievement"]
              })
            }
          >
            Add Experience
          </Button>
        </div>
      </div>
    );
  }

  if (id === "education") {
    const { fields, append, remove } = eduFA;
    return (
      <div className="grid gap-6">
        {fields.map((f, idx) => (
          <div
            key={f.id}
            className="grid gap-3 rounded-md border p-3 md:grid-cols-3"
          >
            <FormField
              control={form.control}
              name={`education.${idx}.school`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`education.${idx}.degree`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`education.${idx}.period`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Period</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:col-span-3 flex justify-end">
              <Button variant="ghost" type="button" onClick={() => remove(idx)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <Button
            variant="secondary"
            type="button"
            onClick={() =>
              append({
                school: "New School",
                degree: "Degree",
                period: "YYYY — YYYY"
              })
            }
          >
            Add Education
          </Button>
        </div>
      </div>
    );
  }

  if (id === "projects") {
    const { fields, append, remove } = projFA;
    return (
      <div className="grid gap-6">
        {fields.map((f, idx) => (
          <div key={f.id} className="grid gap-3 rounded-md border p-3">
            <div className="grid gap-2 md:grid-cols-3">
              <FormField
                control={form.control}
                name={`projects.${idx}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`projects.${idx}.link`}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name={`projects.${idx}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`projects.${idx}.highlights`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Highlights (one per line)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={2}
                      value={(field.value || []).join("\n")}
                      onChange={(e) => {
                        const next = e.target.value
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        form.setValue(`projects.${idx}.highlights`, next, {
                          shouldValidate: true,
                          shouldDirty: true
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button variant="ghost" type="button" onClick={() => remove(idx)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <Button
            variant="secondary"
            type="button"
            onClick={() =>
              append({
                name: "New Project",
                link: "",
                description: "What it does...",
                highlights: ["Key impact"]
              })
            }
          >
            Add Project
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

// Export controls

function ExportControls({
  isValid,
  data,
  order
}: {
  isValid: boolean;
  data: ResumeData;
  order: SectionId[];
}) {
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
