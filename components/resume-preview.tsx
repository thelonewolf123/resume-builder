import type React from "react";
import type { ResumeData, SectionId } from "@/lib/schemas/resume";
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
  return (
    <div className={`resume-content ${className || ""}`} data-pdf-root>
      {/* Header Section */}
      <div className="flex items-start gap-4 mb-6">
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

      {/* Content Sections */}
      <div className="flex flex-col gap-6">
        {order.map((id) => {
          switch (id) {
            case "summary":
              return (
                <Section key={id} title="Summary">
                  <p className="text-gray-700 leading-relaxed">
                    {data.summary}
                  </p>
                </Section>
              );
            case "skills":
              return (
                <Section key={id} title="Skills">
                  <p className="text-gray-700 leading-relaxed">
                    {(data.skills || []).join(" • ")}
                  </p>
                </Section>
              );
            case "experience":
              return (
                <Section key={id} title="Experience">
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
                            <li
                              key={j}
                              className="text-gray-700 text-sm leading-relaxed"
                            >
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Section>
              );
            case "projects":
              return (
                <Section key={id} title="Projects">
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
                            <li
                              key={j}
                              className="text-gray-700 text-sm leading-relaxed"
                            >
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Section>
              );
            case "education":
              return (
                <Section key={id} title="Education">
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
                </Section>
              );
          }
        })}
      </div>
    </div>
  );
}

function Section({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section-content">
      <h3 className="border-b-2 border-gray-300 pb-2 text-base font-bold uppercase tracking-wide text-gray-800 mb-3">
        {title}
      </h3>
      <div className="section-body">{children}</div>
    </section>
  );
}
