import { GROUP_TYPES } from "@/content/carry-forward"
import { getPillar, getPrompt, PILLARS, type PillarId } from "@/content/framework"
import { getPracticeMoment } from "@/content/practice"
import { GUIDE_SLUGS, GUIDE_TITLES, type GuideSlug } from "@/lib/library"
import type { Role } from "@/lib/roles"
import type {
  AiDisagreementFeedback,
  ChangelogEntry,
  DisagreementRecord,
  Effect,
  FeedbackItem,
  FeedbackKind,
  FeedbackTarget,
  FieldNoteRecord,
  OutsideCommunityFeedback,
  Reply,
  WordingVersion,
} from "@/lib/feedback/types"

/**
 * The feedback loop's rules, kept free of React so they can be unit tested:
 * versions, official wording, who may decide, and what each decision publishes.
 */

export const KIND_INFO: Record<FeedbackKind, { label: string; plural: string }> = {
  adaptation: { label: "Local adaptation", plural: "Local adaptations" },
  "didnt-fit": { label: "“This didn’t fit” flag", plural: "“This didn’t fit” flags" },
  "ai-disagreement": { label: "AI disagreement", plural: "AI disagreements" },
  retrospective: { label: "Partner retrospective", plural: "Partner retrospectives" },
  community: { label: "Community feedback", plural: "Community feedback" },
  "outside-community": { label: "Outside community", plural: "Outside communities" },
}

export const EFFECT_INFO: Record<Effect, { label: string; hint: string }> = {
  "field-note": {
    label: "Show it as a field note",
    hint: "A recognized local variant, shown beneath BRIDGEGOOD's official wording on the pillar page, or beneath BRIDGEGOOD's reasoning on a practice moment. The official wording doesn't change.",
  },
  wording: {
    label: "Change BRIDGEGOOD's official wording",
    hint: "Publishes a new version of the framework, with the old and new wording in the public changelog.",
  },
  noted: {
    label: "Take it into the next review",
    hint: "Adds a public changelog entry saying what BRIDGEGOOD will change. The official wording stays as it is for now.",
  },
}

// Versions -------------------------------------------------------------------------------------------

const parts = (v: string) => v.split(".").map((n) => Number.parseInt(n, 10) || 0)

export function compareVersions(a: string, b: string) {
  const [pa, pb] = [parts(a), parts(b)]
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0)
    if (d !== 0) return d
  }
  return 0
}

/** A wording change publishes the next minor version: 0.1 → 0.2. */
export function nextVersion(v: string) {
  const [major = 0, minor = 0] = parts(v)
  return `${major}.${minor + 1}`
}

/** The newest version: the latest published one, or a newer one the steward published in this browser. */
export function currentVersion(published: string, wordings: WordingVersion[]) {
  return wordings.reduce((latest, w) => (compareVersions(w.version, latest) > 0 ? w.version : latest), published)
}

/** BRIDGEGOOD's official meaning for a pillar right now. */
export function officialWording(pillarId: PillarId, wordings: WordingVersion[]) {
  const latest = wordings
    .filter((w) => w.pillarId === pillarId)
    .reduce<WordingVersion | undefined>((best, w) => (!best || compareVersions(w.version, best.version) > 0 ? w : best), undefined)
  return latest ? { text: latest.meaning, version: latest.version } : { text: getPillar(pillarId).meaning, version: undefined }
}

// Labels ---------------------------------------------------------------------------------------------

const isGuide = (id: string): id is GuideSlug => (GUIDE_SLUGS as readonly string[]).includes(id)

export function targetLabel(target: FeedbackTarget): string {
  switch (target.type) {
    case "pillar":
      return `Pillar: ${getPillar(target.id).name}`
    case "prompt":
      return target.id ? `Prompt ${target.id}: ${getPrompt(target.id).text}` : "The 12 reflection prompts"
    case "guide":
      return `Guide: ${isGuide(target.id) ? GUIDE_TITLES[target.id].title : target.id}`
    case "project":
      return "A partner project"
    case "framework":
      return "The whole framework"
    case "practice":
      return `Practice moment: ${getPracticeMoment(target.id)?.title ?? target.id}`
    case "kit":
      return "The carry-it-forward kit"
  }
}

/** A short tag for the inbox list, without the full prompt text. */
export function targetTag(target: FeedbackTarget): string {
  if (target.type === "prompt") return target.id ? `Prompt ${target.id}` : "Reflection prompts"
  return targetLabel(target)
}

export function targetHref(target: FeedbackTarget): string | undefined {
  switch (target.type) {
    case "pillar":
      return `/learn/pillars/${target.id}`
    case "prompt":
      return "/learn/prompts"
    case "guide":
      return `/learn/guides/${target.id}`
    case "practice":
      return `/learn/practice/${target.id}`
    case "kit":
      return "/learn/carry-it-forward"
    default:
      return undefined
  }
}

const withThe = (group: string) => (/^the /i.test(group) ? group : `the ${group}`)

/** Where an item came from, without naming anyone. Used in the public changelog. */
export function sourceLabel(item: FeedbackItem): string {
  switch (item.kind) {
    case "adaptation":
      return `Local adaptation from ${withThe(item.chapter)}`
    case "didnt-fit":
      return `A “this didn’t fit” flag from ${item.from.role === "mentor" ? "a mentor" : "an apprentice"}`
    case "ai-disagreement":
      return `${item.total} “not right” ${item.total === 1 ? "record" : "records"} on AI questions (counts only)`
    case "retrospective":
      return "A project retrospective from a community partner"
    case "community":
      return `Aggregated community feedback: ${item.source}`
    case "outside-community":
      return `${outsideGroup(item, true)} that ran the carry-it-forward kit`
  }
}

/** An outside group as the public sees it: its name only when it said yes to credit. */
export function outsideGroup(item: OutsideCommunityFeedback, capital = false) {
  if (item.credit.consent) return item.credit.as
  const noun = GROUP_TYPES[item.groupType].noun
  return capital ? noun[0].toUpperCase() + noun.slice(1) : noun
}

/** Where a field note came from, as its label shows it: "Local adaptation from …". */
export function noteSource(item: FeedbackItem): string {
  if (item.kind === "adaptation") return item.chapter
  if (item.kind === "outside-community") return `${outsideGroup(item)} outside BRIDGEGOOD`
  return "a chapter"
}

/** A heading for the inbox and the detail page. */
export function itemTitle(item: FeedbackItem): string {
  switch (item.kind) {
    case "adaptation":
      return item.target.type === "practice"
        ? `${item.chapter}: ${getPracticeMoment(item.target.id)?.title ?? "a practice moment"}`
        : `${item.chapter}: ${getPillar(item.pillarIds[0]).name}`
    case "didnt-fit":
      return `Didn\u2019t fit: ${targetTag(item.target)}`
    case "ai-disagreement":
      return `AI disagreement: ${getPillar(item.pillarIds[0]).name}`
    case "retrospective":
      return `Retrospective: ${item.project}`
    case "community":
      return `Community feedback: ${item.source}`
    case "outside-community":
      return `Outside community: ${GROUP_TYPES[item.groupType].label.toLowerCase()}`
  }
}

/** One line for the inbox list. */
export function itemSummary(item: FeedbackItem): string {
  switch (item.kind) {
    case "adaptation":
      return item.changed
    case "didnt-fit":
      return item.note || "Flagged without a note."
    case "ai-disagreement": {
      const top = Object.entries(item.byReason).sort((a, b) => b[1] - a[1])[0]
      return `${item.total} “not right” on AI questions about ${getPillar(item.pillarIds[0]).name}${top ? `. Most common reason: ${top[0].toLowerCase()} (${top[1]})` : ""}.`
    }
    case "retrospective":
      return item.change || item.didnt || item.worked
    case "community":
      return `${item.responses} responses. Top theme: ${item.themes[0]?.theme.toLowerCase() ?? "none yet"}.`
    case "outside-community":
      return item.changed
  }
}

export const isOpen = (item: FeedbackItem) => item.status === "new" || item.status === "in-conversation"

// AI disagreement records → inbox items --------------------------------------------------------------

/**
 * Groups the "not right" records no decision has covered yet into one inbox item per pillar.
 * Counts only: the records never hold the work, a name or the AI's text.
 */
export function openDisagreementGroups(records: DisagreementRecord[], items: FeedbackItem[]): AiDisagreementFeedback[] {
  const covered = new Set(items.flatMap((i) => (i.kind === "ai-disagreement" ? i.recordIds : [])))
  const open = records.filter((r) => !covered.has(r.id))
  return PILLARS.flatMap((pillar) => {
    const group = open.filter((r) => r.pillar === pillar.id)
    if (group.length === 0) return []
    const byReason: Record<string, number> = {}
    const byLens: AiDisagreementFeedback["byLens"] = {}
    for (const r of group) {
      const reason = r.reason || "No reason given"
      byReason[reason] = (byReason[reason] ?? 0) + 1
      byLens[r.lens] = (byLens[r.lens] ?? 0) + 1
    }
    return [
      {
        id: `ai-${pillar.id}`,
        kind: "ai-disagreement",
        at: "Counting since the last decision",
        from: {},
        target: { type: "pillar", id: pillar.id },
        pillarIds: [pillar.id],
        rubricVersion: group[group.length - 1].rubricVersion,
        total: group.length,
        byReason,
        byLens,
        recordIds: group.map((r) => r.id),
        credit: { consent: false },
        status: "new",
        replies: [],
        synthetic: group.every((r) => r.synthetic) || undefined,
      } satisfies AiDisagreementFeedback,
    ]
  })
}

// Decisions ------------------------------------------------------------------------------------------

/**
 * What an accepted item can do. Local adaptations (on a pillar or a practice moment) and outside groups'
 * changes on a pillar can become field notes; only pillar items change wording.
 */
export function allowedEffects(item: FeedbackItem): Effect[] {
  const onPillar = item.target.type === "pillar"
  if (item.kind === "adaptation") return onPillar ? ["field-note", "wording"] : item.target.type === "practice" ? ["field-note", "noted"] : ["noted"]
  if (item.kind === "outside-community") return onPillar ? ["field-note", "noted"] : ["noted"]
  if (item.kind === "didnt-fit") return onPillar ? ["noted", "wording"] : ["noted"]
  return ["noted"]
}

export class DecisionError extends Error {
  field: "reason" | "effect" | "text" | "summary" | "by" | "status"
  constructor(field: DecisionError["field"], message: string) {
    super(message)
    this.field = field
  }
}

export type DecisionInput = {
  outcome: "accepted" | "declined"
  /** Why, always required. */
  reason: string
  effect?: Effect
  /** What changes, for a "noted" changelog entry. */
  summary?: string
  /** The field note text, or the new official wording. */
  text?: string
}

export type DecisionContext = {
  by: Role
  byName: string
  now: string
  newId: () => string
  /** The framework version in force when the decision is made. */
  version: string
  /** The pillar's official wording right now, for a wording change. */
  currentWording?: string
}

export type DecisionResult = { item: FeedbackItem; changelog?: ChangelogEntry; fieldNote?: FieldNoteRecord; wording?: WordingVersion }

/**
 * The steward accepts or declines an item, always with a reason. Accepting publishes a changelog entry,
 * credited only when the sender said yes, and may add a field note or a new official wording.
 */
export function decide(item: FeedbackItem, input: DecisionInput, ctx: DecisionContext): DecisionResult {
  if (ctx.by !== "steward") throw new DecisionError("by", "Only a BRIDGEGOOD steward can decide on feedback.")
  if (!isOpen(item)) throw new DecisionError("status", "This feedback already has a decision.")
  const reason = input.reason.trim()
  if (!reason) throw new DecisionError("reason", "Write the reason for your decision. The person who sent it will see it.")

  const base = { outcome: input.outcome, reason, at: ctx.now, by: ctx.byName }
  if (input.outcome === "declined") return { item: { ...item, status: "declined", decision: base } }

  const effect = input.effect
  if (!effect || !allowedEffects(item).includes(effect)) throw new DecisionError("effect", "Choose what accepting this changes.")
  const text = input.text?.trim() ?? ""
  const summary = input.summary?.trim() ?? ""
  const credit = item.credit.consent ? item.credit.as : undefined
  const changelogId = ctx.newId()
  const entry = { id: changelogId, at: ctx.now, reason, target: item.target, source: sourceLabel(item), credit, feedbackId: item.id }
  const decided: FeedbackItem = { ...item, status: "accepted", decision: { ...base, effect, changelogId } }

  if (effect === "field-note") {
    const { target } = item
    const practice = target.type === "practice" ? getPracticeMoment(target.id) : undefined
    if (!(item.kind === "adaptation" || item.kind === "outside-community") || !(target.type === "pillar" || practice))
      throw new DecisionError("effect", "Only a local adaptation on a pillar or a practice moment can become a field note.")
    if (!text) throw new DecisionError("text", `Write the field note as it will appear on the ${practice ? "practice moment" : "pillar page"}.`)
    const chapter = noteSource(item)
    const where = practice ? practice.title : getPillar((target as { id: PillarId }).id).name
    const at = practice ? { practice: practice.slug } : { pillarId: (target as { id: PillarId }).id }
    return {
      item: decided,
      changelog: {
        ...entry,
        version: ctx.version,
        type: "field-note",
        title: `Field note: ${where}, ${chapter}`,
        summary: summary || (practice ? `Recognized as a local variant on the practice moment ${where}.` : `Recognized as a local variant on the ${where} pillar.`),
      },
      fieldNote: { id: ctx.newId(), ...at, chapter, text, version: ctx.version, at: ctx.now, changelogId, credit },
    }
  }

  if (effect === "wording") {
    if (item.target.type !== "pillar") throw new DecisionError("effect", "Only a pillar's wording can change.")
    if (!text) throw new DecisionError("text", "Write the new official wording.")
    if (text === ctx.currentWording?.trim()) throw new DecisionError("text", "The new wording is the same as the current wording.")
    const pillar = getPillar(item.target.id)
    const version = nextVersion(ctx.version)
    return {
      item: decided,
      changelog: {
        ...entry,
        version,
        type: "wording",
        title: `New wording: ${pillar.name}`,
        summary: summary || `BRIDGEGOOD changed the official meaning of the ${pillar.name} pillar.`,
        before: ctx.currentWording,
        after: text,
      },
      wording: { id: ctx.newId(), pillarId: pillar.id, version, meaning: text, at: ctx.now, changelogId },
    }
  }

  if (!summary) throw new DecisionError("summary", "Say what BRIDGEGOOD will change, for the public changelog.")
  return {
    item: decided,
    changelog: { ...entry, version: ctx.version, type: "noted", title: `Noted for the next review: ${targetTag(item.target)}`, summary },
  }
}

/** A steward's change to the official wording without a piece of feedback behind it. */
export function changeWording(
  pillarId: PillarId,
  input: { text: string; reason: string },
  ctx: DecisionContext
): { changelog: ChangelogEntry; wording: WordingVersion } {
  if (ctx.by !== "steward") throw new DecisionError("by", "Only a BRIDGEGOOD steward can change the official wording.")
  const text = input.text.trim()
  const reason = input.reason.trim()
  if (!text) throw new DecisionError("text", "Write the new official wording.")
  if (text === ctx.currentWording?.trim()) throw new DecisionError("text", "The new wording is the same as the current wording.")
  if (!reason) throw new DecisionError("reason", "Write why the wording is changing. It appears in the public changelog.")
  const pillar = getPillar(pillarId)
  const version = nextVersion(ctx.version)
  const changelogId = ctx.newId()
  return {
    changelog: {
      id: changelogId,
      at: ctx.now,
      version,
      type: "wording",
      title: `New wording: ${pillar.name}`,
      summary: `BRIDGEGOOD changed the official meaning of the ${pillar.name} pillar.`,
      reason,
      target: { type: "pillar", id: pillarId },
      before: ctx.currentWording,
      after: text,
      source: "BRIDGEGOOD's own review",
    },
    wording: { id: ctx.newId(), pillarId, version, meaning: text, at: ctx.now, changelogId },
  }
}

/** Whether the steward can reply: the sender is a demo account, or an outside group with a reply code. */
export function canReply(item: FeedbackItem) {
  return !!item.from.role || item.kind === "outside-community"
}

// Reply codes ----------------------------------------------------------------------------------------

/** No 0/O, 1/I/L or 5/S, so a code read aloud or copied by hand still works. */
const CODE_ALPHABET = "ABCDEFGHJKMNPQRTUVWXYZ2346789"

/** A code like "BG-7KQ4-M2XP" an outside group uses to check BRIDGEGOOD's reply, instead of an email. */
export function newReplyCode(random: (n: number) => Uint8Array = (n) => crypto.getRandomValues(new Uint8Array(n))) {
  const chars = [...random(8)].map((b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("")
  return `BG-${chars.slice(0, 4)}-${chars.slice(4)}`
}

/** Accepts a code typed loosely: any case, spaces or no dashes. */
export function normalizeReplyCode(code: string) {
  const raw = code.toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/^BG/, "")
  return raw.length === 8 ? `BG-${raw.slice(0, 4)}-${raw.slice(4)}` : ""
}

export function findByReplyCode(items: FeedbackItem[], code: string) {
  const wanted = normalizeReplyCode(code)
  return wanted ? items.find((i): i is OutsideCommunityFeedback => i.kind === "outside-community" && i.replyCode === wanted) : undefined
}

/** Adds a reply. A steward's reply on an open item moves it to "in conversation". */
export function addReply(item: FeedbackItem, reply: Reply): FeedbackItem {
  const text = reply.text.trim()
  if (!text) throw new DecisionError("reason", "Write a reply first.")
  const status = reply.from === "steward" && item.status === "new" ? "in-conversation" : item.status
  return { ...item, status, replies: [...item.replies, { ...reply, text }] }
}
