import type React from "react";
import type { ResumeData, SectionId, LayoutType } from "@/lib/schemas/resume";
import Image from "next/image";

export default function ResumePreview({
  data,
  order,
  className
}: {
  data: ResumeData;
  order: SectionId[];
  className?: string;
}) {
  const layout = data.layout || "classic";
  const activeSections = data.activeSections || order;
  const filteredOrder = order.filter((id) => activeSections.includes(id));

  // Layout-specific classes
  const layoutClasses = getLayoutClasses(layout);

  return (
    <div
      className={`resume-content ${className || ""} ${layoutClasses.container}`}
      data-pdf-root
    >
      {/* Header Section */}
      <ResumeHeader data={data} layout={layout} />

      {/* Content Sections */}
      {layout === "two-column" ? (
        <TwoColumnLayout data={data} order={filteredOrder} />
      ) : (
        <SingleColumnLayout data={data} order={filteredOrder} layout={layout} />
      )}
    </div>
  );
}

function ResumeHeader({
  data,
  layout
}: {
  data: ResumeData;
  layout: LayoutType;
}) {
  const headerClasses = getLayoutClasses(layout).header;

  return (
    <div className={`flex items-start gap-4 mb-6 ${headerClasses}`}>
      {data.photoUrl ? (
        <Image
          src={
            data.photoUrl ||
            "/placeholder.svg?height=64&width=64&query=profile%20photo"
          }
          alt={data.fullName ? `${data.fullName} photo` : "Profile photo"}
          className="h-16 w-16 rounded-full object-cover border flex-shrink-0"
          width={100}
          height={100}
        />
      ) : null}
      <div className="flex flex-col items-start gap-1 min-w-0 flex-1">
        <h1 className="text-balance text-2xl font-bold text-gray-900 leading-tight">
          {data.fullName || "Your Name"}
        </h1>
        <p className="text-lg text-gray-700 font-medium">{data.title}</p>
        <div className="flex flex-wrap gap-2 text-sm text-gray-600 mt-1">
          <span>{data.contact.email}</span>
          <span>•</span>
          <span>{data.contact.phone}</span>
          <span>•</span>
          <span>{data.contact.location}</span>
          {data.contact.website ? (
            <>
              <span>•</span>
              <a
                className="underline underline-offset-4 text-blue-600 hover:text-blue-800"
                href={data.contact.website}
                target="_blank"
                rel="noreferrer"
              >
                {data.contact.website}
              </a>
            </>
          ) : null}
          {data.contact.github ? (
            <>
              <span>•</span>
              <a
                className="underline underline-offset-4 text-blue-600 hover:text-blue-800"
                href={data.contact.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </>
          ) : null}
          {data.contact.linkedin ? (
            <>
              <span>•</span>
              <a
                className="underline underline-offset-4 text-blue-600 hover:text-blue-800"
                href={data.contact.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SingleColumnLayout({
  data,
  order,
  layout
}: {
  data: ResumeData;
  order: SectionId[];
  layout: LayoutType;
}) {
  const sectionClasses = getLayoutClasses(layout).section;

  return (
    <div className="flex flex-col gap-6">
      {order.map((id) => {
        const sectionContent = getSectionContent(data, id);
        if (!sectionContent) return null;

        return (
          <Section
            key={id}
            title={getSectionTitle(id)}
            layout={layout}
            className={sectionClasses}
          >
            {sectionContent}
          </Section>
        );
      })}
    </div>
  );
}

function TwoColumnLayout({
  data,
  order
}: {
  data: ResumeData;
  order: SectionId[];
}) {
  // Split sections into left and right columns
  const leftSections = ["summary", "skills"];
  const rightSections = ["experience", "projects", "education"];

  const leftOrder = order.filter((id) => leftSections.includes(id));
  const rightOrder = order.filter((id) => rightSections.includes(id));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="md:col-span-1 space-y-6">
        {leftOrder.map((id) => {
          const sectionContent = getSectionContent(data, id);
          if (!sectionContent) return null;

          return (
            <Section
              key={id}
              title={getSectionTitle(id)}
              layout="two-column"
              className="bg-gray-50 p-4 rounded-lg"
            >
              {sectionContent}
            </Section>
          );
        })}
      </div>

      {/* Right Column */}
      <div className="md:col-span-2 space-y-6">
        {rightOrder.map((id) => {
          const sectionContent = getSectionContent(data, id);
          if (!sectionContent) return null;

          return (
            <Section key={id} title={getSectionTitle(id)} layout="two-column">
              {sectionContent}
            </Section>
          );
        })}
      </div>
    </div>
  );
}

function getSectionTitle(id: SectionId): string {
  const titles: Record<SectionId, string> = {
    summary: "Summary",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects"
  };
  return titles[id];
}

function getSectionContent(
  data: ResumeData,
  id: SectionId
): React.ReactNode | null {
  switch (id) {
    case "summary":
      return data.summary ? (
        <p className="text-gray-700 leading-relaxed">{data.summary}</p>
      ) : null;
    case "skills":
      return data.skills?.length ? (
        <p className="text-gray-700 leading-relaxed">
          {data.skills.join(" • ")}
        </p>
      ) : null;
    case "experience":
      return data.experience?.length ? (
        <div className="flex flex-col gap-4">
          {data.experience.map((e, i) => (
            <div key={i} className="experience-item">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <strong className="text-gray-900 font-semibold text-base">
                  {e.role} — {e.company}
                </strong>
                <span className="text-sm text-gray-600 font-medium">
                  {e.period}
                </span>
              </div>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                {e.details?.map((d, j) => (
                  <li key={j} className="text-gray-700 text-sm leading-relaxed">
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null;
    case "projects":
      return data.projects?.length ? (
        <div className="flex flex-col gap-4">
          {data.projects.map((p, i) => (
            <div key={i} className="project-item">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <strong className="text-gray-900 font-semibold text-base">
                  {p.name}{" "}
                  {p.link ? (
                    <a
                      className="text-blue-600 underline underline-offset-4 hover:text-blue-800"
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      (link)
                    </a>
                  ) : null}
                </strong>
              </div>
              <p className="mt-1 text-gray-700 text-sm leading-relaxed">
                {p.description}
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                {p.highlights.map((h, j) => (
                  <li key={j} className="text-gray-700 text-sm leading-relaxed">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null;
    case "education":
      return data.education?.length ? (
        <div className="flex flex-col gap-3">
          {data.education.map((e, i) => (
            <div
              key={i}
              className="flex flex-wrap items-baseline justify-between gap-2"
            >
              <strong className="text-gray-900 font-semibold text-base">
                {e.degree}, {e.school}
              </strong>
              <span className="text-sm text-gray-600 font-medium">
                {e.period}
              </span>
            </div>
          ))}
        </div>
      ) : null;
    default:
      return null;
  }
}

function getLayoutClasses(layout: LayoutType) {
  switch (layout) {
    case "classic":
      return {
        container: "",
        header: "",
        section: ""
      };
    case "modern":
      return {
        container: "bg-gradient-to-br from-slate-50 to-blue-50",
        header: "bg-white rounded-lg p-6 shadow-sm",
        section: "bg-white rounded-lg p-4 shadow-sm"
      };
    case "minimal":
      return {
        container: "",
        header: "border-l-4 border-blue-500 pl-4",
        section: "border-l-2 border-gray-200 pl-4"
      };
    case "two-column":
      return {
        container: "",
        header: "",
        section: ""
      };
    case "compact":
      return {
        container: "text-sm",
        header: "mb-4",
        section: "mb-4"
      };
    default:
      return {
        container: "",
        header: "",
        section: ""
      };
  }
}

function Section({
  title,
  children,
  layout,
  className
}: {
  title: string;
  children: React.ReactNode;
  layout?: LayoutType;
  className?: string;
}) {
  const getTitleClasses = (layout?: LayoutType) => {
    switch (layout) {
      case "modern":
        return "text-lg font-bold text-blue-700 mb-4 pb-2 border-b border-blue-200";
      case "minimal":
        return "text-base font-semibold text-gray-800 mb-3 uppercase tracking-wider";
      case "compact":
        return "text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide";
      case "two-column":
        return "text-base font-bold text-gray-800 mb-3 pb-1 border-b border-gray-300";
      default:
        return "border-b-2 border-gray-300 pb-2 text-base font-bold uppercase tracking-wide text-gray-800 mb-3";
    }
  };

  return (
    <section className={`section-content ${className || ""}`}>
      <h3 className={getTitleClasses(layout)}>{title}</h3>
      <div className="section-body">{children}</div>
    </section>
  );
}
