/**
 * The Design for Social Good framework: 5 pillars, each with a plain meaning, one
 * concrete example, a learning outcome, and the reflection prompts that belong to it.
 *
 * Pillars describe what students learn. The principles in principles.ts describe how
 * BRIDGEGOOD works with every role. They are related but separate.
 *
 * DRAFT. The hackathon team drafted these from BRIDGEGOOD's brief. BRIDGEGOOD
 * reviews, approves and owns the final wording. The prompt-to-pillar mapping matches
 * the shared evaluator rubric in docs/ai-evaluator.md (section 3), plus prompts 5 and 6.
 */

export const FRAMEWORK_META = {
  title: "Design for Social Good framework",
  author: "BRIDGEGOOD",
  status: "Draft for BRIDGEGOOD review",
  version: "0.1",
  updated: "Oct 24, 2026",
  note: "Drafted by the hackathon team from BRIDGEGOOD's challenge brief. BRIDGEGOOD authors and owns the philosophy, and approves any change to this wording.",
} as const

export const PILLAR_IDS = ["design-for-good", "access-inclusion", "responsible-ai", "craft", "ethics-impact"] as const
export type PillarId = (typeof PILLAR_IDS)[number]

export type ReflectionPromptId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export type ReflectionPrompt = {
  id: ReflectionPromptId
  /** Canonical wording from the team spec. Keep verbatim. */
  text: string
  pillarIds: PillarId[]
}

/** The 12 reflection prompts, verbatim. Numbered 1–12 to match the evaluator schema. */
export const REFLECTION_PROMPTS: ReflectionPrompt[] = [
  { id: 1, text: "Who benefits from this decision?", pillarIds: ["design-for-good"] },
  { id: 2, text: "Who might be left out?", pillarIds: ["design-for-good", "access-inclusion"] },
  { id: 3, text: "Whose voice has not been heard yet?", pillarIds: ["design-for-good"] },
  {
    id: 4,
    text: "Are we solving the problem people actually have, or the problem we assume they have?",
    pillarIds: ["design-for-good"],
  },
  { id: 5, text: "What lived experiences are represented in the room?", pillarIds: ["design-for-good", "access-inclusion"] },
  { id: 6, text: "What lived experiences are missing?", pillarIds: ["design-for-good", "access-inclusion"] },
  {
    id: 7,
    text: "Is this accessible to people with different abilities, resources, devices, languages, or circumstances?",
    pillarIds: ["access-inclusion", "craft"],
  },
  {
    id: 8,
    text: "Are we choosing what is easiest for us or what is most useful for the community?",
    pillarIds: ["design-for-good"],
  },
  { id: 9, text: "What unintended impact could this decision create?", pillarIds: ["responsible-ai", "ethics-impact"] },
  { id: 10, text: "How could the people affected by this work help shape it?", pillarIds: ["responsible-ai"] },
  {
    id: 11,
    text: "Does this solution increase someone's agency, confidence, access, or opportunity?",
    pillarIds: ["design-for-good", "ethics-impact"],
  },
  {
    id: 12,
    text: "What would we change if we were designing with the community rather than only for the community?",
    pillarIds: ["design-for-good"],
  },
]

export type Pillar = {
  id: PillarId
  number: number
  name: string
  /** Plain-language meaning, grade 6–8 reading level. */
  meaning: string
  /** One concrete example of the pillar in a project. Synthetic. */
  inPractice: string
  learningOutcome: string
  /** Reflection prompts that belong to this pillar (derived from REFLECTION_PROMPTS). */
  promptIds: ReflectionPromptId[]
}

const promptsFor = (id: PillarId) => REFLECTION_PROMPTS.filter((p) => p.pillarIds.includes(id)).map((p) => p.id)

export const PILLARS: Pillar[] = [
  {
    id: "design-for-good",
    number: 1,
    name: "Design for Good",
    meaning:
      "A design is good when the people it affects helped define the problem and judged the result, and when the designers grew through the work. Good intentions are not enough. You show it with evidence from the people affected.",
    inPractice:
      "Before sketching a booking flow for a food pantry, the team asks visitors how they book today. Many don't have smartphones, so the team designs a text-message option first.",
    learningOutcome: "Explain and critique what makes a design \"good\" for the people it affects.",
    promptIds: promptsFor("design-for-good"),
  },
  {
    id: "access-inclusion",
    number: 2,
    name: "Accessibility & Inclusion",
    meaning:
      "People with different abilities, devices, languages, money and time can use what you make. The people most likely to be left out help decide what gets built. WCAG 2.2 AA is the minimum, not the goal.",
    inPractice:
      "The team tests a sign-up form with a screen reader user and on an older phone with a slow connection. They fix the error messages the screen reader didn't read out, and cut the form from 12 questions to 5.",
    learningOutcome: "Audit and fix accessibility barriers.",
    promptIds: promptsFor("access-inclusion"),
  },
  {
    id: "responsible-ai",
    number: 3,
    name: "Responsible AI",
    meaning:
      "AI is a tool, held to the same standard as any other tool. You decide when it helps, say when you used it, check what it gets wrong, and keep decisions about people with people.",
    inPractice:
      "A student uses an AI tool to draft alt text for 40 images. They check each one against the image, rewrite the ones that miss what matters, and note in the case study where AI was used.",
    learningOutcome: "Decide when and how to use AI responsibly.",
    promptIds: promptsFor("responsible-ai"),
  },
  {
    id: "craft",
    number: 4,
    name: "Good Design Craft",
    meaning:
      "Craft is how clearly the work communicates: layout, hierarchy, type, spacing, writing, and states like errors and empty screens. Polish should serve what the community needs most, not only the portfolio.",
    inPractice:
      "On a tenant-rights site, the team puts \"Got an eviction notice? Start here\" at the top in large type with one clear button, and moves the organization's history further down the page.",
    learningOutcome: "Make clear, polished designs with strong hierarchy.",
    promptIds: promptsFor("craft"),
  },
  {
    id: "ethics-impact",
    number: 5,
    name: "Ethics & Impact",
    meaning:
      "Every design has effects beyond what it was meant to do. You look for harm before it happens: dark patterns (design tricks that push people into choices they didn't mean to make), collecting more data than needed, or settings that expose people by default.",
    inPractice:
      "The team removes a pre-checked box that signed families up for marketing texts, and changes the form to ask only for what the clinic needs on the day of the visit.",
    learningOutcome: "Identify and redesign harmful or manipulative patterns.",
    promptIds: promptsFor("ethics-impact"),
  },
]

export const DECISION_MOMENTS = ["studentSubmit", "mentorReview", "partnerBrief"] as const
export type DecisionMoment = (typeof DECISION_MOMENTS)[number]

/**
 * Which 2–3 prompts to show at each decision point in the app. The person answers in
 * their own words. Nothing is scored.
 */
export const PROMPTS_BY_MOMENT: Record<DecisionMoment, ReflectionPromptId[]> = {
  /** Before a student submits work for mentor feedback. */
  studentSubmit: [1, 2, 11],
  /** While a mentor prepares or writes a critique. */
  mentorReview: [3, 4, 8],
  /** While a partner writes or reviews a project brief. */
  partnerBrief: [4, 7, 10],
}

export const DECISION_MOMENT_INFO: Record<DecisionMoment, { label: string; intro: string }> = {
  studentSubmit: {
    label: "Before you submit",
    intro: "Take a minute with these questions. Your answers go to your mentor with your work, and only if you choose to share them.",
  },
  mentorReview: {
    label: "Before you write feedback",
    intro: "Start from the student's own reflection. Use these questions to shape what you ask, not to grade the student.",
  },
  partnerBrief: {
    label: "Before you send your brief",
    intro: "These questions help the team start from your community's real needs. A person at BRIDGEGOOD reads every brief.",
  },
}

export function getPrompt(id: ReflectionPromptId): ReflectionPrompt {
  return REFLECTION_PROMPTS.find((p) => p.id === id)!
}

export function getPillar(id: PillarId): Pillar {
  return PILLARS.find((p) => p.id === id)!
}

export function promptsForMoment(moment: DecisionMoment): ReflectionPrompt[] {
  return PROMPTS_BY_MOMENT[moment].map(getPrompt)
}
