import { PILLARS, type PillarId } from "@/content/framework"

/** Limits shared by the reflection page and src/routes/api.reflect.ts. They keep requests under Vercel's 4.5 MB body limit. */
export const REFLECT_LIMITS = {
  /** User and assistant turns together: a first review plus a few follow-ups. */
  messages: 9,
  /** Characters in one user message (the composed note). */
  userText: 4000,
  /** Characters in one assistant message (a review as JSON). */
  assistantText: 16000,
  /** Characters the apprentice can type in the note field. */
  note: 2500,
  /** Screenshots across the whole conversation. */
  images: 4,
  imageTypes: ["image/png", "image/jpeg", "image/webp"],
  outputTokens: 3000,
} as const

export const STAGES = [
  { id: "mini-project", label: "Mini project" },
  { id: "capstone-understand", label: "Capstone, week 1: understand" },
  { id: "capstone-decide", label: "Capstone, week 2: decide" },
  { id: "capstone-build", label: "Capstone, week 3: build and test" },
  { id: "capstone-present", label: "Capstone, week 4: present" },
] as const
export type StageId = (typeof STAGES)[number]["id"]

export type ReflectRequest = {
  stage: StageId
  focus: PillarId[]
  note: string
  imageCount: number
}

/** The first message the apprentice sends: their note plus the context the companion needs. */
export function composeFirstMessage({ stage, focus, note, imageCount }: ReflectRequest) {
  const stageLabel = STAGES.find((s) => s.id === stage)?.label ?? "Not given"
  const focusNames = PILLARS.filter((p) => focus.includes(p.id)).map((p) => p.name)
  return [
    `Stage: ${stageLabel}`,
    `Pillars I want to focus on: ${focusNames.length ? focusNames.join(", ") : "Any"}`,
    `Screenshots attached: ${imageCount}`,
    "",
    "What I made and what I was trying to do:",
    note.trim(),
  ].join("\n")
}

/** A follow-up after a review: more context, or what changed since. */
export function composeFollowUp(note: string, imageCount: number) {
  return [`Follow-up. Screenshots attached: ${imageCount}`, "", note.trim()].join("\n")
}
