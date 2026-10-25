import type { PillarId } from "@/content/framework"
import { useCollection } from "@/lib/demo-store"

/**
 * DEMO collections for the Reflection Companion, in this browser's localStorage (see demo-store.ts).
 * Screenshots are never stored. Nothing here holds a score.
 */

/** One question the apprentice kept, in their own (possibly edited) words. */
export type KeptQuestion = {
  pillar?: PillarId
  promptIds: number[]
  question: string
  answer: string
  /** Where it came from: the companion (AI), the companion edited by the apprentice, or the standard prompts. */
  origin: "ai" | "ai-edited" | "prompt"
}

export type SavedReflection = {
  id: string
  savedAt: string
  stage: string
  rubricVersion: string
  questions: KeptQuestion[]
}

/** A question the apprentice chose to share with their mentor as a conversation starter. Answers aren't shared. */
export type ConversationStarter = Omit<KeptQuestion, "answer"> & {
  id: string
  sharedAt: string
  from: string
  mentor: string
  stage: string
}

/** Feedback on one AI item (docs/ai-evaluator.md, section 6). It never includes the work itself. */
export type EvaluatorFeedback = {
  id: string
  at: string
  rubricVersion: string
  lens: "student"
  pillar?: PillarId
  observationKind?: "ai-observation" | "question-only"
  verdict: "useful" | "not-right" | "missing"
  reason?: string
}

const NONE: never[] = []

export const useReflections = () => useCollection<SavedReflection>("reflections", NONE)
export const useConversationStarters = () => useCollection<ConversationStarter>("mentor-conversation-starters", NONE)
export const useEvaluatorFeedback = () => useCollection<EvaluatorFeedback>("evaluator-feedback", NONE)
