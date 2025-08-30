import type { ResumeData } from "@/lib/schemas/resume";

export const emptyResume: ResumeData = {
  fullName: "",
  title: "",
  contact: {
    email: "",
    phone: "",
    location: "",
    website: "",
    github: "",
    linkedin: ""
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  photoUrl: ""
};

export const demoResume: ResumeData = {
  fullName: "Alex Johnson",
  title: "Senior Frontend Engineer",
  contact: {
    email: "alex.johnson@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    website: "https://alex.dev",
    github: "https://github.com/alex",
    linkedin: "https://linkedin.com/in/alex"
  },
  summary:
    "Frontend engineer with 7+ years building accessible, performant web apps. Specializes in React, TypeScript, and design systems. Passionate about developer experience and crafting delightful UX.",
  experience: [
    {
      role: "Senior Frontend Engineer",
      company: "Acme Corp",
      period: "2022 — Present",
      details: [
        "Led migration to React Server Components, improving TTI by 28%.",
        "Built a reusable component library adopted by 4 teams.",
        "Partnered with design to improve accessibility to WCAG AA."
      ]
    },
    {
      role: "Frontend Engineer",
      company: "Startup XYZ",
      period: "2019 — 2022",
      details: [
        "Shipped onboarding funnel that increased activation by 15%.",
        "Implemented end-to-end type safety with TypeScript."
      ]
    }
  ],
  education: [
    {
      school: "University of Somewhere",
      degree: "B.S. Computer Science",
      period: "2015 — 2019"
    }
  ],
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Tailwind CSS",
    "Testing Library",
    "Playwright",
    "Accessibility"
  ],
  projects: [
    {
      name: "OpenSource UI",
      link: "https://github.com/alex/opensource-ui",
      description:
        "Composable component library for building accessible, themed UIs.",
      highlights: ["2k+ stars", "Theming system", "ARIA-compliant primitives"]
    }
  ]
};

export function composeResumePlainText(data: ResumeData) {
  const lines: string[] = [];
  lines.push(`${data.fullName} — ${data.title}`);
  const contact = [
    data.contact.email,
    data.contact.phone,
    data.contact.location,
    data.contact.website,
    data.contact.github,
    data.contact.linkedin
  ].filter(Boolean);
  if (contact.length) lines.push(contact.join(" • "));
  if (data.summary) lines.push("", "Summary:", data.summary);

  if (data.skills?.length) {
    lines.push("", "Skills:", data.skills.join(", "));
  }
  if (data.experience?.length) {
    lines.push("", "Experience:");
    for (const e of data.experience) {
      lines.push(`- ${e.role} — ${e.company} (${e.period})`);
      for (const d of e.details || []) lines.push(`  • ${d}`);
    }
  }
  if (data.projects?.length) {
    lines.push("", "Projects:");
    for (const p of data.projects) {
      lines.push(`- ${p.name}${p.link ? ` (${p.link})` : ""}`);
      if (p.description) lines.push(`  • ${p.description}`);
      for (const h of p.highlights) lines.push(`  • ${h}`);
    }
  }
  if (data.education?.length) {
    lines.push("", "Education:");
    for (const e of data.education)
      lines.push(`- ${e.degree} — ${e.school} (${e.period})`);
  }
  return lines.join("\n");
}

export function computeResumeAtsMetrics(
  resumeText: string,
  jobDescription: string
) {
  const text = String(resumeText || "").trim();
  const jd = String(jobDescription || "").trim();

  if (!text || !jd) {
    return {
      wordCount: 0,
      sectionsFilled: 0,
      readability: 0,
      presentKeywords: [],
      missingKeywords: [],
      suggestions: [],
      score: 0
    };
  }

  // Word count calculation
  const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;

  // Section detection with more flexible matching
  const sectionPatterns = [
    { name: "Summary", patterns: [/summary/i, /profile/i, /objective/i] },
    { name: "Skills", patterns: [/skills/i, /technologies/i, /tools/i] },
    {
      name: "Experience",
      patterns: [/experience/i, /work history/i, /employment/i]
    },
    {
      name: "Projects",
      patterns: [/projects/i, /portfolio/i, /achievements/i]
    },
    {
      name: "Education",
      patterns: [/education/i, /academic/i, /qualifications/i]
    }
  ];

  const sectionsFilled = sectionPatterns.reduce((acc, section) => {
    const hasSection = section.patterns.some((pattern) => pattern.test(text));
    return acc + (hasSection ? 1 : 0);
  }, 0);

  // Improved keyword extraction and matching
  const extractKeywords = (text: string): Set<string> => {
    return new Set(
      text
        .toLowerCase()
        .replace(/[^\w\s]/g, " ") // Remove punctuation
        .split(/\s+/)
        .filter(
          (word) => word.length >= 3 && word.length <= 20 && !isCommonWord(word)
        )
    );
  };

  const isCommonWord = (word: string): boolean => {
    const commonWords = new Set([
      "the",
      "and",
      "for",
      "are",
      "but",
      "not",
      "you",
      "all",
      "can",
      "had",
      "her",
      "was",
      "one",
      "our",
      "out",
      "day",
      "get",
      "has",
      "him",
      "his",
      "how",
      "man",
      "new",
      "now",
      "old",
      "see",
      "two",
      "way",
      "who",
      "boy",
      "did",
      "its",
      "let",
      "put",
      "say",
      "she",
      "too",
      "use"
    ]);
    return commonWords.has(word);
  };

  const jdKeywords = extractKeywords(jd);
  const resumeKeywords = extractKeywords(text);

  // Find matching and missing keywords
  const presentKeywords = Array.from(jdKeywords).filter((keyword) =>
    resumeKeywords.has(keyword)
  );
  const missingKeywords = Array.from(jdKeywords).filter(
    (keyword) => !resumeKeywords.has(keyword)
  );

  // Calculate keyword match percentage
  const keywordMatchRate =
    jdKeywords.size > 0 ? presentKeywords.length / jdKeywords.size : 0;

  // Improved readability scoring
  const calculateReadability = (): number => {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const avgSentenceLength =
      sentences.length > 0
        ? sentences.reduce(
            (sum, s) => sum + s.split(/\s+/).filter((w) => w.length > 0).length,
            0
          ) / sentences.length
        : 0;

    // Flesch Reading Ease approximation
    const fleschScore = Math.max(
      0,
      Math.min(
        100,
        206.835 -
          1.015 * avgSentenceLength -
          84.6 * (wordCount / Math.max(1, sentences.length))
      )
    );

    return Math.max(0, Math.min(1, fleschScore / 100));
  };

  const readability = calculateReadability();

  // Overall ATS score calculation
  const calculateATSScore = (): number => {
    const sectionScore = (sectionsFilled / 5) * 0.3; // 30% weight for sections
    const keywordScore = keywordMatchRate * 0.4; // 40% weight for keywords
    const lengthScore = Math.min(1, wordCount / 300) * 0.2; // 20% weight for length
    const readabilityScore = readability * 0.1; // 10% weight for readability

    return Math.round(
      (sectionScore + keywordScore + lengthScore + readabilityScore) * 100
    );
  };

  const score = calculateATSScore();

  // Generate contextual suggestions
  const generateSuggestions = (): string[] => {
    const suggestions: string[] = [];

    // Section suggestions
    if (!sectionPatterns.some((s) => s.patterns.some((p) => p.test(text)))) {
      suggestions.push(
        "Add a Summary section to introduce yourself and your career objectives."
      );
    }

    if (
      !sectionPatterns
        .find((s) => s.name === "Skills")
        ?.patterns.some((p) => p.test(text))
    ) {
      suggestions.push(
        "Include a Skills section highlighting your technical competencies and tools."
      );
    }

    if (
      !sectionPatterns
        .find((s) => s.name === "Experience")
        ?.patterns.some((p) => p.test(text))
    ) {
      suggestions.push(
        "Add an Experience section with detailed work history and achievements."
      );
    }

    // Keyword suggestions
    if (missingKeywords.length > 0) {
      const topMissing = missingKeywords.slice(0, 3);
      suggestions.push(
        `Consider incorporating these job-relevant terms: ${topMissing.join(
          ", "
        )}.`
      );
    }

    // Length and content suggestions
    if (wordCount < 200) {
      suggestions.push(
        "Expand your resume with more detailed descriptions of experiences and achievements."
      );
    } else if (wordCount > 800) {
      suggestions.push(
        "Consider condensing your resume to focus on the most relevant experiences."
      );
    }

    if (readability < 0.6) {
      suggestions.push(
        "Improve readability by using shorter sentences and clear bullet points."
      );
    }

    if (keywordMatchRate < 0.3) {
      suggestions.push(
        "Increase alignment with the job description by incorporating more relevant keywords."
      );
    }

    return suggestions;
  };

  const suggestions = generateSuggestions();

  return {
    wordCount,
    sectionsFilled,
    readability,
    presentKeywords,
    missingKeywords,
    suggestions,
    score,
    keywordMatchRate: Math.round(keywordMatchRate * 100)
  };
}
