import { PILLARS, REFLECTION_PROMPTS, type PillarId, type ReflectionPromptId } from "@/content/framework"

/**
 * The shared evaluator rubric (docs/ai-evaluator.md, section 3), as data.
 *
 * DRAFT. BRIDGEGOOD owns this rubric and approves every change. Bump RUBRIC_VERSION whenever
 * the wording or mapping changes, so each saved review records which version it used.
 */
export const RUBRIC_VERSION = "0.1-draft"

/**
 * Prompts the AI may ask about but never answer (kind C, "human only"): who is left out, whose
 * voice is missing, lived experience, whether the problem is real. They only ever appear as questions.
 */
export const HUMAN_ONLY_PROMPT_IDS: ReflectionPromptId[] = [1, 2, 3, 4, 5, 6, 8, 10, 12]

export type RubricPillar = {
  id: PillarId
  name: string
  meaning: string
  promptIds: ReflectionPromptId[]
  /** Things the AI may point at, as observations a person checks (kind B). */
  aiMayNotice: string[]
  /** Things only people can judge (kind C). The AI turns these into questions. */
  humanOnly: string[]
}

const NOTES: Record<PillarId, Pick<RubricPillar, "aiMayNotice" | "humanOnly">> = {
  "design-for-good": {
    aiMayNotice: ["Solution-first framing (the note starts from the app, not the problem)", "Success defined as clicks, sign-ups or page views"],
    humanOnly: ["Who benefits", "Who is left out", "Whether this is the problem people actually have"],
  },
  "access-inclusion": {
    aiMayNotice: [
      "Low contrast estimated from a screenshot (always 'please check with the contrast tool', never a pass or fail)",
      "Icon-only controls",
      "Language and reading level",
      "Assumptions about devices, bandwidth or time",
    ],
    humanOnly: ["Whether disabled people were involved", "Which languages and circumstances the community needs"],
  },
  "responsible-ai": {
    aiMayNotice: ["AI-generated content without a note saying so", "Automated decisions about people"],
    humanOnly: ["Whether AI was the right tool here", "How the people affected could shape the work"],
  },
  craft: {
    aiMayNotice: ["Visual hierarchy", "Clarity of the main action", "Consistency", "Missing or unclear error and empty states"],
    humanOnly: ["Whether the craft serves the community's priorities"],
  },
  "ethics-impact": {
    aiMayNotice: ["Dark patterns (confirmshaming, pre-ticked consent, hidden cancel)", "Asking for more data than needed", "Privacy defaults"],
    humanOnly: ["Unintended impact", "What success means to the community"],
  },
}

export const RUBRIC: RubricPillar[] = PILLARS.map((p) => ({
  id: p.id,
  name: p.name,
  meaning: p.meaning,
  promptIds: p.promptIds,
  ...NOTES[p.id],
}))

export const RUBRIC_PROMPTS = REFLECTION_PROMPTS

export function pillarName(id: PillarId) {
  return RUBRIC.find((p) => p.id === id)?.name ?? id
}

export function promptText(id: number) {
  return REFLECTION_PROMPTS.find((p) => p.id === id)?.text
}
