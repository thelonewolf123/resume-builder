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
  photoUrl: "",
  layout: "classic",
  activeSections: ["summary", "experience", "education", "skills", "projects"]
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
  ],
  layout: "classic",
  activeSections: ["summary", "experience", "education", "skills", "projects"]
};

export function composeResumePlainText(data: ResumeData, order?: string[]) {
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

  const activeSections = data.activeSections || [
    "summary",
    "experience",
    "education",
    "skills",
    "projects"
  ];
  const sectionOrder = order || activeSections;

  // Only include sections that are active and in the specified order
  sectionOrder.forEach((sectionId) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!activeSections.includes(sectionId as any)) return;

    switch (sectionId) {
      case "summary":
        if (data.summary) lines.push("", "Summary:", data.summary);
        break;
      case "skills":
        if (data.skills?.length) {
          lines.push("", "Skills:", data.skills.join(", "));
        }
        break;
      case "experience":
        if (data.experience?.length) {
          lines.push("", "Experience:");
          for (const e of data.experience) {
            lines.push(`- ${e.role} — ${e.company} (${e.period})`);
            for (const d of e.details || []) lines.push(`  • ${d}`);
          }
        }
        break;
      case "projects":
        if (data.projects?.length) {
          lines.push("", "Projects:");
          for (const p of data.projects) {
            lines.push(`- ${p.name}${p.link ? ` (${p.link})` : ""}`);
            if (p.description) lines.push(`  • ${p.description}`);
            for (const h of p.highlights) lines.push(`  • ${h}`);
          }
        }
        break;
      case "education":
        if (data.education?.length) {
          lines.push("", "Education:");
          for (const e of data.education)
            lines.push(`- ${e.degree} — ${e.school} (${e.period})`);
        }
        break;
    }
  });

  return lines.join("\n");
}

/**
 * Enhanced ATS metrics computation with improved algorithms and comprehensive analysis
 */
export function computeResumeAtsMetrics(
  resumeText: string,
  jobDescription: string,
  data?: ResumeData
) {
  const text = String(resumeText || "").trim();
  const jd = String(jobDescription || "").trim();

  // Handle missing inputs
  if (!text) {
    return {
      wordCount: 0,
      sectionsFilled: 0,
      activeSectionCount: data?.activeSections?.length || 5,
      readability: 0,
      presentKeywords: [],
      missingKeywords: [],
      suggestions: ["Add resume content to get ATS analysis"],
      score: 0,
      keywordMatchRate: 0,
      contactCompleteness: 0,
      quantifiableAchievements: 0,
      industryTerms: 0,
      formatConsistency: 0
    };
  }

  // If no job description, provide general resume analysis
  const hasJobDescription = !!jd;

  // Enhanced word count with better tokenization
  const words = text.match(/\b[a-zA-Z]+\b/g) || [];
  const wordCount = words.length;

  // Accurate section detection using actual resume data
  const detectSectionCompleteness = (): number => {
    if (!data) return 0;

    const activeSections = data.activeSections || [
      "summary",
      "experience",
      "education",
      "skills",
      "projects"
    ];
    let filledSections = 0;

    activeSections.forEach((sectionId) => {
      switch (sectionId) {
        case "summary":
          if (data.summary && data.summary.trim().length > 10) filledSections++;
          break;
        case "experience":
          if (data.experience && data.experience.length > 0) {
            const hasDetailedExperience = data.experience.some(
              (exp) =>
                exp.role &&
                exp.company &&
                exp.period &&
                exp.details &&
                exp.details.length > 0
            );
            if (hasDetailedExperience) filledSections++;
          }
          break;
        case "education":
          if (data.education && data.education.length > 0) {
            const hasCompleteEducation = data.education.some(
              (edu) => edu.school && edu.degree && edu.period
            );
            if (hasCompleteEducation) filledSections++;
          }
          break;
        case "skills":
          if (data.skills && data.skills.length >= 3) filledSections++;
          break;
        case "projects":
          if (data.projects && data.projects.length > 0) {
            const hasDetailedProjects = data.projects.some(
              (proj) =>
                proj.name &&
                proj.description &&
                proj.highlights &&
                proj.highlights.length > 0
            );
            if (hasDetailedProjects) filledSections++;
          }
          break;
      }
    });

    return filledSections;
  };

  const sectionsFilled = detectSectionCompleteness();
  const activeSectionCount = data?.activeSections?.length || 5;

  // Advanced keyword extraction with industry-specific processing
  const extractAdvancedKeywords = (
    text: string
  ): {
    keywords: Set<string>;
    phrases: Set<string>;
    industryTerms: Set<string>;
  } => {
    const cleanText = text.toLowerCase();

    // Extract single keywords
    const words = cleanText
      .replace(/[^\w\s\-]/g, " ")
      .split(/\s+/)
      .filter(
        (word) =>
          word.length >= 2 &&
          word.length <= 25 &&
          !isStopWord(word) &&
          !/^\d+$/.test(word) // Exclude pure numbers
      );

    // Extract meaningful phrases (2-4 words)
    const phrases = new Set<string>();
    for (let i = 0; i < words.length - 1; i++) {
      const twoWordPhrase = `${words[i]} ${words[i + 1]}`;
      const threeWordPhrase =
        i < words.length - 2
          ? `${words[i]} ${words[i + 1]} ${words[i + 2]}`
          : null;

      if (twoWordPhrase.length <= 50 && isSignificantPhrase(twoWordPhrase)) {
        phrases.add(twoWordPhrase);
      }
      if (
        threeWordPhrase &&
        threeWordPhrase.length <= 50 &&
        isSignificantPhrase(threeWordPhrase)
      ) {
        phrases.add(threeWordPhrase);
      }
    }

    // Identify industry/technical terms
    const industryTerms = new Set<string>();
    [...words, ...phrases].forEach((term) => {
      if (isIndustryTerm(term)) {
        industryTerms.add(term);
      }
    });

    return {
      keywords: new Set(words),
      phrases,
      industryTerms
    };
  };

  const isStopWord = (word: string): boolean => {
    const stopWords = new Set([
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
      "use",
      "may",
      "will",
      "would",
      "could",
      "should",
      "than",
      "that",
      "this",
      "they",
      "them",
      "have",
      "been",
      "were",
      "said",
      "each",
      "which",
      "their",
      "time",
      "into",
      "only",
      "other",
      "after",
      "first",
      "well",
      "also",
      "where",
      "when",
      "what",
      "some",
      "more",
      "very",
      "about",
      "from",
      "come",
      "made",
      "many",
      "over",
      "such",
      "take",
      "year",
      "your",
      "just",
      "work",
      "life",
      "even",
      "back",
      "any",
      "good",
      "much",
      "own",
      "under",
      "think",
      "also",
      "its",
      "before",
      "here",
      "through",
      "being",
      "both"
    ]);
    return stopWords.has(word);
  };

  const isSignificantPhrase = (phrase: string): boolean => {
    // Check if phrase contains at least one meaningful word
    const words = phrase.split(/\s+/);
    return words.some(
      (word) => !isStopWord(word) && word.length >= 3 && !/^\d+$/.test(word)
    );
  };

  const isIndustryTerm = (term: string): boolean => {
    const techPatterns = [
      // Programming languages
      /\b(javascript|typescript|python|java|react|angular|vue|node|express|spring|django|flask)\b/i,
      // Cloud platforms
      /\b(aws|azure|gcp|docker|kubernetes|terraform|ansible)\b/i,
      // Databases
      /\b(sql|mysql|postgresql|mongodb|redis|elasticsearch)\b/i,
      // Methodologies
      /\b(agile|scrum|devops|ci\/cd|microservices|api|rest|graphql)\b/i,
      // Business terms
      /\b(roi|kpi|crm|erp|saas|b2b|b2c|analytics|automation)\b/i,
      // Skills indicators
      /\b(led|managed|developed|implemented|designed|optimized|increased|reduced|improved)\b/i
    ];

    return techPatterns.some((pattern) => pattern.test(term));
  };

  // Extract keywords from resume text
  const resumeAnalysis = extractAdvancedKeywords(text);

  // Handle keyword analysis based on whether job description exists
  let presentKeywords: string[] = [];
  const missingKeywords: string[] = [];
  let keywordMatchRate = 0;
  let jdAnalysis: ReturnType<typeof extractAdvancedKeywords>;

  if (hasJobDescription) {
    // Full keyword analysis with job description
    jdAnalysis = extractAdvancedKeywords(jd);
    const allJdTerms = new Set([...jdAnalysis.keywords, ...jdAnalysis.phrases]);
    const allResumeTerms = new Set([
      ...resumeAnalysis.keywords,
      ...resumeAnalysis.phrases
    ]);

    Array.from(allJdTerms).forEach((term) => {
      if (allResumeTerms.has(term)) {
        presentKeywords.push(term);
      } else {
        // Check for partial matches or synonyms
        const hasPartialMatch = Array.from(allResumeTerms).some(
          (resumeTerm) => resumeTerm.includes(term) || term.includes(resumeTerm)
        );
        if (!hasPartialMatch) {
          missingKeywords.push(term);
        }
      }
    });

    keywordMatchRate =
      allJdTerms.size > 0 ? presentKeywords.length / allJdTerms.size : 0;
  } else {
    // Show industry terms from resume when no job description
    presentKeywords = Array.from(resumeAnalysis.industryTerms).slice(0, 10);
    jdAnalysis = {
      keywords: new Set(),
      phrases: new Set(),
      industryTerms: new Set()
    };
    keywordMatchRate = 0; // Can't calculate without job description
  }

  // Contact information completeness
  const calculateContactCompleteness = (): number => {
    if (!data?.contact) return 0;

    const requiredFields = ["email", "phone", "location"];
    const optionalFields = ["website", "github", "linkedin"];

    let score = 0;
    requiredFields.forEach((field) => {
      if (data.contact[field as keyof typeof data.contact]) score += 0.5;
    });
    optionalFields.forEach((field) => {
      if (data.contact[field as keyof typeof data.contact]) score += 0.17;
    });

    return Math.min(1, score);
  };

  // Quantifiable achievements detection
  const calculateQuantifiableAchievements = (): number => {
    const numberPatterns = [
      /\b\d+%/g, // Percentages
      /\b\$[\d,]+/g, // Money amounts
      /\b\d+[kK]\+?/g, // Thousands (10k, 50K+)
      /\b\d+(\.\d+)?[xX]/g, // Multipliers (2x, 3.5x)
      /\b\d+\s*(years?|months?|weeks?|days?)/gi, // Time periods
      /\b(increased|decreased|improved|reduced|grew|generated|saved|managed|led)\s+.*?\b\d+/gi
    ];

    let achievementCount = 0;
    numberPatterns.forEach((pattern) => {
      const matches = text.match(pattern);
      if (matches) achievementCount += matches.length;
    });

    // Normalize based on resume length
    const expectedAchievements = Math.max(2, Math.floor(wordCount / 150));
    return Math.min(1, achievementCount / expectedAchievements);
  };

  // Industry terms coverage
  const industryTermsCoverage = (): number => {
    const jdIndustryTerms = jdAnalysis.industryTerms.size;

    if (jdIndustryTerms === 0) return 1; // No industry terms to match

    const matchingIndustryTerms = Array.from(jdAnalysis.industryTerms).filter(
      (term) => resumeAnalysis.industryTerms.has(term)
    ).length;

    return matchingIndustryTerms / jdIndustryTerms;
  };

  // Format consistency check
  const calculateFormatConsistency = (): number => {
    let consistencyScore = 1.0;

    // Check for consistent date formatting
    const datePatterns = text.match(
      /\b\d{4}\b|\b\d{1,2}\/\d{4}\b|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{4}\b/gi
    );
    if (datePatterns && datePatterns.length > 1) {
      const uniqueFormats = new Set(
        datePatterns.map((date) => {
          if (/^\d{4}$/.test(date)) return "year";
          if (/^\d{1,2}\/\d{4}$/.test(date)) return "month/year";
          return "month year";
        })
      );
      if (uniqueFormats.size > 1) consistencyScore -= 0.2;
    }

    // Check for consistent bullet point usage
    const bulletLines = text
      .split("\n")
      .filter((line) => line.trim().match(/^[•\-\*]/));
    if (bulletLines.length > 0) {
      const bulletTypes = new Set(bulletLines.map((line) => line.trim()[0]));
      if (bulletTypes.size > 1) consistencyScore -= 0.2;
    }

    return Math.max(0, consistencyScore);
  };

  // Enhanced readability calculation
  const calculateEnhancedReadability = (): number => {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 5);
    if (sentences.length === 0) return 0;

    const avgSentenceLength =
      sentences.reduce((sum, sentence) => {
        const sentenceWords = sentence
          .trim()
          .split(/\s+/)
          .filter((w) => w.length > 0);
        return sum + sentenceWords.length;
      }, 0) / sentences.length;

    // Optimal sentence length for resumes is 15-20 words
    const sentenceLengthScore =
      avgSentenceLength >= 8 && avgSentenceLength <= 25
        ? 1
        : Math.max(0, 1 - Math.abs(avgSentenceLength - 17) / 17);

    // Check for action verbs at sentence beginnings
    const actionVerbs = [
      "achieved",
      "administered",
      "analyzed",
      "built",
      "collaborated",
      "created",
      "delivered",
      "developed",
      "directed",
      "established",
      "executed",
      "generated",
      "implemented",
      "improved",
      "increased",
      "led",
      "managed",
      "optimized",
      "organized",
      "reduced",
      "resolved",
      "streamlined",
      "supervised",
      "transformed"
    ];

    const actionVerbCount = sentences.filter((sentence) => {
      const firstWord = sentence.trim().split(/\s+/)[0]?.toLowerCase();
      return actionVerbs.includes(firstWord);
    }).length;

    const actionVerbScore =
      sentences.length > 0 ? actionVerbCount / sentences.length : 0;

    return sentenceLengthScore * 0.7 + actionVerbScore * 0.3;
  };

  // Calculate all metrics
  const contactCompleteness = calculateContactCompleteness();
  const quantifiableAchievements = calculateQuantifiableAchievements();
  const industryTerms = industryTermsCoverage();
  const formatConsistency = calculateFormatConsistency();
  const readability = calculateEnhancedReadability();

  // Comprehensive ATS score calculation with modern weighting
  const calculateComprehensiveATSScore = (): number => {
    const sectionScore = (sectionsFilled / activeSectionCount) * 0.3; // 30% - Section completeness
    const lengthScore = calculateOptimalLength() * 0.2; // 20% - Optimal length
    const readabilityScore = readability * 0.15; // 15% - Readability
    const contactScore = contactCompleteness * 0.1; // 10% - Contact completeness
    const achievementScore = quantifiableAchievements * 0.15; // 15% - Quantifiable achievements
    const formatScore = formatConsistency * 0.1; // 10% - Format consistency

    if (hasJobDescription) {
      // Include keyword matching when job description is available
      const keywordScore = keywordMatchRate * 0.25; // 25% - Keyword alignment
      const industryScore = industryTerms * 0.05; // 5% - Industry terms

      // Adjust other weights when including keyword scores
      return Math.round(
        (sectionScore * 0.85 + // Reduce section weight slightly
          keywordScore +
          lengthScore * 0.85 + // Reduce length weight slightly
          readabilityScore * 0.85 + // Reduce readability weight slightly
          contactScore +
          achievementScore +
          industryScore +
          formatScore) *
          100
      );
    } else {
      // Focus on general resume quality without keyword matching
      return Math.round(
        (sectionScore +
          lengthScore +
          readabilityScore +
          contactScore +
          achievementScore +
          formatScore) *
          100
      );
    }
  };

  const calculateOptimalLength = (): number => {
    // Optimal resume length: 400-700 words
    if (wordCount >= 400 && wordCount <= 700) return 1;
    if (wordCount >= 300 && wordCount < 400) return 0.8;
    if (wordCount >= 700 && wordCount <= 900) return 0.8;
    if (wordCount >= 200 && wordCount < 300) return 0.6;
    if (wordCount > 900 && wordCount <= 1200) return 0.6;
    return Math.max(0.2, 1 - Math.abs(wordCount - 550) / 550);
  };

  const score = calculateComprehensiveATSScore();

  // Intelligent suggestions generation
  const generateIntelligentSuggestions = (): string[] => {
    const suggestions: string[] = [];

    // Section-specific suggestions
    if (data) {
      const activeSections = data.activeSections || [];

      if (
        activeSections.includes("summary") &&
        (!data.summary || data.summary.length < 50)
      ) {
        suggestions.push(
          "Write a compelling 2-3 sentence professional summary highlighting your key value proposition."
        );
      }

      if (
        activeSections.includes("experience") &&
        data.experience.length === 0
      ) {
        suggestions.push(
          "Add work experience with specific achievements and quantifiable results."
        );
      } else if (data.experience.length > 0) {
        const experienceWithoutDetails = data.experience.filter(
          (exp) => !exp.details || exp.details.length === 0
        );
        if (experienceWithoutDetails.length > 0) {
          suggestions.push(
            "Add bullet points to your experience entries describing specific accomplishments."
          );
        }
      }

      if (activeSections.includes("skills") && data.skills.length < 5) {
        suggestions.push(
          "Expand your skills section to include more relevant technical and soft skills."
        );
      }
    }

    // Keyword optimization suggestions
    if (hasJobDescription) {
      if (keywordMatchRate < 0.4) {
        const priorityMissing = missingKeywords
          .filter((keyword) => jdAnalysis.industryTerms.has(keyword))
          .slice(0, 5);

        if (priorityMissing.length > 0) {
          suggestions.push(
            `Incorporate these high-priority keywords: ${priorityMissing.join(
              ", "
            )}`
          );
        }
      }
    } else {
      // Suggest adding job description for better analysis
      suggestions.push(
        'Add a job description via "Build with AI" to get targeted keyword suggestions and improve ATS alignment.'
      );
    }

    // Content quality suggestions
    if (quantifiableAchievements < 0.3) {
      suggestions.push(
        "Add more quantifiable achievements (percentages, dollar amounts, time savings, team sizes)."
      );
    }

    if (contactCompleteness < 0.8) {
      suggestions.push(
        "Complete your contact information including professional links (LinkedIn, GitHub, portfolio)."
      );
    }

    // Length optimization
    if (wordCount < 300) {
      suggestions.push(
        "Expand your resume with more detailed descriptions of your accomplishments and skills."
      );
    } else if (wordCount > 800) {
      suggestions.push(
        "Condense your resume by focusing on the most relevant and impactful experiences."
      );
    }

    // Readability improvements
    if (readability < 0.6) {
      suggestions.push(
        "Improve readability by using active voice, bullet points, and concise language."
      );
    }

    // Industry alignment
    if (hasJobDescription && industryTerms < 0.5) {
      suggestions.push(
        "Include more industry-specific terminology and technical skills mentioned in the job description."
      );
    } else if (!hasJobDescription && resumeAnalysis.industryTerms.size < 3) {
      suggestions.push(
        "Include more industry-specific terminology and technical skills relevant to your field."
      );
    }

    // Format consistency
    if (formatConsistency < 0.8) {
      suggestions.push(
        "Ensure consistent formatting for dates, bullet points, and section headers."
      );
    }

    // Provide actionable suggestions when score is low
    if (score < 60) {
      suggestions.push(
        "Focus on aligning your resume more closely with the job requirements and using relevant keywords."
      );
    }

    return suggestions.slice(0, 6); // Limit to most important suggestions
  };

  const suggestions = generateIntelligentSuggestions();

  return {
    wordCount,
    sectionsFilled,
    activeSectionCount,
    readability: Math.round(readability * 100) / 100,
    presentKeywords: presentKeywords.slice(0, 15), // Limit for UI performance
    missingKeywords: missingKeywords.slice(0, 15),
    suggestions,
    score,
    keywordMatchRate: hasJobDescription
      ? Math.round(keywordMatchRate * 100)
      : 0,
    contactCompleteness: Math.round(contactCompleteness * 100),
    quantifiableAchievements: Math.round(quantifiableAchievements * 100),
    industryTerms: hasJobDescription
      ? Math.round(industryTerms * 100)
      : Math.round(
          (resumeAnalysis.industryTerms.size /
            Math.max(10, resumeAnalysis.keywords.size / 10)) *
            100
        ),
    formatConsistency: Math.round(formatConsistency * 100)
  };
}
