import {
  CONTRIBUTION_KINDS,
  REVIEW_CHECKS,
  type AttributionMode,
  type ContributionKind,
  type Entry,
  type EntryType,
  type TemplateKey,
} from "@/content/playbook"

/**
 * Living Playbook logic: pure functions, so the review workflow can be unit tested.
 * Submit → Review → Discuss → Publish → Maintain → Improve.
 */

const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/
const PHONE = /(?:\+?\d[\s().-]?){7,}/

/** Flags text that looks like it contains contact details, so they never get saved. */
export function containsContactDetails(text: string) {
  return EMAIL.test(text) || PHONE.test(text)
}

export type Draft = {
  kind: ContributionKind | ""
  title: string
  fields: Partial<Record<TemplateKey, string>>
  attributionMode: AttributionMode
  attributionAs: string
  consent: boolean
  related?: Entry["related"]
}

export type DraftError = { field: string; message: string }

export function validateDraft(d: Draft): DraftError[] {
  const errors: DraftError[] = []
  if (!d.kind) errors.push({ field: "kind", message: "Choose what you're contributing" })
  if (!d.title.trim()) errors.push({ field: "title", message: "Give your contribution a short title" })
  if (!d.fields.context?.trim()) errors.push({ field: "context", message: "Describe the context" })
  if (!d.fields.challenge?.trim()) errors.push({ field: "challenge", message: "Describe the challenge or question" })
  if (d.attributionMode !== "anonymous" && !d.attributionAs.trim())
    errors.push({ field: "attributionAs", message: "Say how you'd like to be credited, or choose anonymous" })
  if (!d.consent) errors.push({ field: "consent", message: "Confirm the contribution doesn't disclose personal or confidential information without consent" })
  const allText = [d.title, d.attributionAs, ...Object.values(d.fields)].join(" ")
  if (containsContactDetails(allText)) errors.push({ field: "context", message: "Remove email addresses and phone numbers before submitting" })
  return errors
}

export function suggestedType(kind: ContributionKind): EntryType {
  return CONTRIBUTION_KINDS.find((k) => k.id === kind)!.suggests
}

export function attributionLabel(mode: AttributionMode, as: string) {
  return mode === "anonymous" ? "A community member" : as.trim()
}

export function createEntry(d: Draft, id: string, at: string): Entry {
  const kind = d.kind as ContributionKind
  const as = attributionLabel(d.attributionMode, d.attributionAs)
  return {
    id,
    type: suggestedType(kind),
    kind,
    title: d.title.trim(),
    fields: Object.fromEntries(Object.entries(d.fields).map(([k, v]) => [k, (v ?? "").trim()]).filter(([, v]) => v)),
    attribution: { mode: d.attributionMode, as },
    consentConfirmed: d.consent,
    status: "submitted",
    checks: {},
    replies: [],
    history: [{ at, by: as, action: "Submitted", version: "0.1" }],
    version: "0.1",
    submittedAt: at,
    related: d.related,
    themes: [],
    mine: true,
  }
}

export const allChecksPassed = (e: Entry) => REVIEW_CHECKS.every((c) => e.checks[c.id])

export function addReply(e: Entry, from: "steward" | "contributor", text: string, id: string, at: string, by: string): Entry {
  return {
    ...e,
    status: e.status === "submitted" && from === "steward" ? "in-discussion" : e.status,
    replies: [...e.replies, { id, from, text: text.trim(), at }],
    history: from === "steward" ? [...e.history, { at, by, action: "Asked the contributor a question", version: e.version }] : e.history,
  }
}

/** Publishing needs every review check, and records a new major version. */
export function publish(e: Entry, type: EntryType, at: string, by: string): Entry {
  if (!allChecksPassed(e)) throw new Error("Every review check must pass before publishing.")
  const version = e.status === "published" ? bump(e.version) : "1.0"
  return {
    ...e,
    type,
    status: "published",
    reviewedAt: at,
    version,
    history: [...e.history, { at, by, action: e.status === "published" ? "Revised" : "Reviewed and published", version }],
  }
}

export function decline(e: Entry, reason: string, at: string, by: string): Entry {
  if (!reason.trim()) throw new Error("Say why, so the contributor understands.")
  return { ...e, status: "declined", declineReason: reason.trim(), reviewedAt: at, history: [...e.history, { at, by, action: "Declined", version: e.version }] }
}

function bump(version: string) {
  const [major, minor = "0"] = version.split(".")
  return `${major}.${Number(minor) + 1}`
}

/** Recurring themes across published community contributions, most frequent first. */
export function recurringThemes(entries: Entry[]) {
  const counts = new Map<string, number>()
  for (const e of entries) if (e.status === "published" && e.type !== "core") for (const t of e.themes) counts.set(t, (counts.get(t) ?? 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([theme, count]) => ({ theme, count }))
}
