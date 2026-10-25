/**
 * Writing conventions for all copy in the app, based on BRIDGEGOOD's tone guide
 * (bridgegood.com/design): supportive, direct, trustworthy and approachable.
 * DRAFT for BRIDGEGOOD to review.
 */
export const WRITING_RULES = {
  readingLevel: "Grade 6 to 8. Short sentences, common words. Explain any term above that level the first time you use it.",
  spelling: "US spelling and US date and time style, for example \"Tue, Oct 29, 4:00 PM PT\".",
  case: "Sentence case for headings, buttons and labels.",
  pronouns: "Gender-neutral. Use \"they\" when you don't know someone's pronouns. Speak to the reader as \"you\".",
  synthetic: "Label every made-up person, project or result \"Synthetic example\". Never present one as a real BRIDGEGOOD participant.",
}

/**
 * Disability language convention. We use identity-first language ("disabled people",
 * "Deaf people", "blind people"), which many disability communities prefer. When a
 * person or community tells you what they prefer, use their words.
 */
export const DISABILITY_CONVENTION = {
  convention: "identity-first" as const,
  examples: ["disabled people", "Deaf people", "blind people", "wheelchair users", "screen reader users"],
  note: "Use identity-first language everywhere in the app. When a person or community says they prefer other words, use theirs.",
}

/** Words to avoid, and what to say instead. Asset-based: describe what people have and do, not what they lack. */
export const PREFERRED_TERMS: { avoid: string; use: string }[] = [
  { avoid: "minorities, under-privileged, the needy", use: "people from groups underrepresented in design, or name the community specifically" },
  { avoid: "low literacy", use: "people who prefer images to text, or plain-language readers" },
  { avoid: "the disabled, people suffering from…, wheelchair-bound", use: "disabled people, wheelchair users" },
  { avoid: "underserved (on its own)", use: "say what isn't reaching people, for example \"services don't reach families without a smartphone\"" },
  { avoid: "prams", use: "strollers" },
  { avoid: "vanity metrics", use: "numbers that only look good, like page views" },
  { avoid: "CSR, ERG, L&D (unexplained)", use: "corporate social responsibility (CSR), employee resource group (ERG), learning and development (L&D)" },
  { avoid: "capstone (unexplained, for partners)", use: "partner project, or explain: the final project in a student's training" },
  { avoid: "pass, fail, success or failure (for students)", use: "where the work is now, and what to try next" },
]
