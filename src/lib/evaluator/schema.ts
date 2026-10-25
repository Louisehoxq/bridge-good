import { z } from "zod"
import { PILLAR_IDS } from "@/content/framework"

/**
 * Output shape shared by every evaluator lens (docs/ai-evaluator.md, section 3).
 *
 * There are no score, level, pass or rank fields. The schema enforces this, not just the prompt.
 */
export const PILLARS = PILLAR_IDS
export const LENSES = ["student", "mentor", "partner", "ambassador"] as const

export const evidenceSchema = z.object({
  kind: z
    .enum(["automated-check", "visible-in-image", "quoted-text", "absent"])
    .describe("'absent' = something the rubric expects that isn't there"),
  where: z.string().describe("Region of the screenshot, field of the brief, or quoted words. No personal details."),
  ruleId: z.string().optional().describe("axe / WCAG id, only for automated-check"),
})

export const observationSchema = z.object({
  pillar: z.enum(PILLARS),
  promptIds: z.array(z.number().int().min(1).max(12)).describe("Reflection prompts this connects to"),
  kind: z.enum(["automated", "ai-observation", "question-only"]),
  noticed: z.string().describe("What I noticed, stated as an observation, not a verdict"),
  evidence: z.array(evidenceSchema).min(1),
  confidence: z.enum(["low", "medium", "high"]).describe("How sure I am about what I noticed, not about whether it's good"),
  question: z.string().describe("An open question for the person. Starts with What, Who, How or Was"),
})

export const strengthSchema = z.object({
  pillar: z.enum(PILLARS),
  noticed: z.string(),
  evidence: z.array(evidenceSchema).min(1),
})

export const reviewSchema = z.object({
  lens: z.enum(LENSES),
  rubricVersion: z.string(),
  summary: z.string().max(400).describe("2–3 sentences, plain language, no praise inflation, no grade"),
  observations: z.array(observationSchema).max(12),
  strengths: z.array(strengthSchema).max(4),
  cannotJudge: z.array(z.string()).min(1).describe("What this review can't see or decide, e.g. 'whether the community was consulted'"),
  humanNext: z.string().describe("Who should look at this next and what to bring them"),
  personalDataNoticed: z.boolean().describe("True if the upload seemed to contain personal details; they are never repeated"),
})
export type Review = z.infer<typeof reviewSchema>

/**
 * Student lens (the AI Reflection Companion). Phase 1 has no deterministic checks on screenshots,
 * so the model can't produce "automated" items: a screenshot is not an audit.
 */
const studentEvidenceSchema = evidenceSchema.extend({
  kind: z.enum(["visible-in-image", "quoted-text", "absent"]).describe("'absent' = something the rubric expects that isn't there"),
})

export const studentObservationSchema = observationSchema.extend({
  kind: z
    .enum(["ai-observation", "question-only"])
    .describe("'question-only' for anything only people can judge (who is left out, lived experience, real users)"),
  evidence: z.array(studentEvidenceSchema).min(1),
})

export const studentReviewSchema = reviewSchema.extend({
  lens: z.literal("student"),
  observations: z.array(studentObservationSchema).max(12),
  strengths: z.array(strengthSchema.extend({ evidence: z.array(studentEvidenceSchema).min(1) })).max(4),
  /** Lens extra: prompts the student answers in their own words. */
  reflectionPrompts: z
    .array(
      z.object({
        promptId: z.number().int().min(1).max(12),
        question: z.string().describe("The prompt, made specific to this project. The student answers it, not you."),
      })
    )
    .max(3),
})
export type StudentReview = z.infer<typeof studentReviewSchema>
export type StudentObservation = z.infer<typeof studentObservationSchema>
