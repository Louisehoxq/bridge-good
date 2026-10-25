import type { StudioRole } from "@/components/studio/role-badge"
import type { PillarId, ReflectionPromptId } from "@/content/framework"

/**
 * The feedback loop (milestone 3): every kind of feedback lands in one BRIDGEGOOD steward inbox.
 * Nothing here holds personal data. Notes are free text the sender writes, screened for email addresses
 * and phone numbers before they're saved, and senders are the synthetic demo accounts.
 */
export const FEEDBACK_KINDS = ["adaptation", "didnt-fit", "ai-disagreement", "retrospective", "community"] as const
export type FeedbackKind = (typeof FEEDBACK_KINDS)[number]

/** What the feedback is about. It also tags the item in the inbox. */
export type FeedbackTarget =
  | { type: "pillar"; id: PillarId }
  | { type: "prompt"; id?: ReflectionPromptId }
  | { type: "guide"; id: string }
  | { type: "project"; id: string }
  | { type: "framework" }

/** Who sent it. Aggregated items (AI disagreement counts, community cards) have no role or name. */
export type FeedbackSender = {
  role?: StudioRole
  /** The demo account's name, so they can see what happened. Shown to the steward, never credited without consent. */
  name?: string
  /** A chapter or organization, shown with field notes. */
  group?: string
}

/** Credit in the public changelog happens only when the sender says yes. */
export type Credit = { consent: false } | { consent: true; as: string }

export type Reply = { id: string; from: "steward" | "sender"; text: string; at: string }

/**
 * What the steward does with an accepted item:
 * - field-note: a recognized local variant, shown beneath the official wording on the pillar page
 * - wording: a change to BRIDGEGOOD's official wording, which publishes a new version
 * - noted: taken into the next review, with a public changelog entry saying what will change
 */
export type Effect = "field-note" | "wording" | "noted"

export type Decision = {
  outcome: "accepted" | "declined"
  /** Required. The sender and the public changelog both see it. */
  reason: string
  at: string
  by: string
  effect?: Effect
  changelogId?: string
}

/** new → in-conversation (the steward replied) → accepted or declined. */
export type FeedbackStatus = "new" | "in-conversation" | "accepted" | "declined"

type Base = {
  id: string
  at: string
  from: FeedbackSender
  target: FeedbackTarget
  /** Pillars this touches, for tagging and filtering. */
  pillarIds: PillarId[]
  credit: Credit
  status: FeedbackStatus
  decision?: Decision
  replies: Reply[]
  synthetic?: boolean
}

export type AdaptationFeedback = Base & {
  kind: "adaptation"
  chapter: string
  changed: string
  why: string
  kept: string
  happened: string
  /** Keep it as a local variant, or suggest BRIDGEGOOD changes the core wording. */
  ask: "local" | "core"
}

export type DidntFitFeedback = Base & { kind: "didnt-fit"; note?: string }

/** Counts of "not right" on AI items for one pillar, from the Reflection Companion and mentor critique prep. */
export type AiDisagreementFeedback = Base & {
  kind: "ai-disagreement"
  rubricVersion: string
  total: number
  byReason: Record<string, number>
  byLens: Partial<Record<"student" | "mentor", number>>
  /** The individual records this item covers, so new ones open a new item. */
  recordIds: string[]
}

export type RetrospectiveFeedback = Base & {
  kind: "retrospective"
  project: string
  worked: string
  didnt: string
  change: string
  /** How the community took part, as a choice. No names. */
  communityRole: "shaped" | "consulted" | "not-yet"
}

/** An aggregated card: counts and themes only. */
export type CommunityFeedback = Base & {
  kind: "community"
  source: string
  responses: number
  themes: { theme: string; count: number; pillarId?: PillarId }[]
}

export type FeedbackItem = AdaptationFeedback | DidntFitFeedback | AiDisagreementFeedback | RetrospectiveFeedback | CommunityFeedback

export type ChangelogType = "published" | "wording" | "field-note" | "noted"

export type ChangelogEntry = {
  id: string
  at: string
  /** The framework version this entry belongs to. Only wording changes publish a new one. */
  version: string
  type: ChangelogType
  title: string
  /** What changed, in the steward's words. */
  summary: string
  /** Why, in the steward's words. */
  reason: string
  target?: FeedbackTarget
  before?: string
  after?: string
  /** Where it came from, without names: "Local adaptation from the Oakland chapter". */
  source: string
  /** Only when the contributor said yes. */
  credit?: string
  feedbackId?: string
  synthetic?: boolean
}

/** A recognized local variant, shown beneath BRIDGEGOOD's official wording on a pillar page. */
export type FieldNoteRecord = {
  id: string
  pillarId: PillarId
  chapter: string
  text: string
  version: string
  at: string
  changelogId: string
  credit?: string
  synthetic?: boolean
}

/** A new official wording for a pillar's meaning. Only the steward creates these. */
export type WordingVersion = {
  id: string
  pillarId: PillarId
  version: string
  meaning: string
  at: string
  changelogId: string
}

/** One "not right" record from an AI feedback control, as the inbox reads it. Never holds the work itself. */
export type DisagreementRecord = {
  id: string
  pillar: PillarId
  lens: "student" | "mentor"
  reason?: string
  rubricVersion: string
  synthetic?: boolean
}
