import type { IconName } from "@/components/icon"

/**
 * The Living Playbook keeps four kinds of content apart, so BRIDGEGOOD keeps clear authorship
 * while welcoming community contributions. Seed entries are SYNTHETIC examples.
 */
export const ENTRY_TYPES = [
  { id: "core", label: "Core philosophy", description: "BRIDGEGOOD-authored principles and guidance.", icon: "scroll-text" },
  { id: "practice", label: "Practice example", description: "Community contributions that illustrate how the philosophy is applied.", icon: "pencil-ruler" },
  { id: "adaptation", label: "Local adaptation", description: "Approaches developed for a specific community or context.", icon: "map-pin" },
  { id: "question", label: "Open question", description: "Areas where more discussion, evidence, or learning is needed.", icon: "messages-square" },
] as const satisfies readonly { id: string; label: string; description: string; icon: IconName }[]

export type EntryType = (typeof ENTRY_TYPES)[number]["id"]

/** What a community member can contribute (MD §3, Feature 3). Each suggests a Playbook label; the steward decides. */
export const CONTRIBUTION_KINDS = [
  { id: "lesson", label: "A lesson learned from a project or mentoring experience", suggests: "practice" },
  { id: "adaptation", label: "An adaptation of a tool for a particular context", suggests: "adaptation" },
  { id: "question", label: "A question or tension the current guidance doesn't address", suggests: "question" },
  { id: "resource-feedback", label: "Feedback on a resource that was confusing or inaccessible", suggests: "question" },
  { id: "scenario", label: "A proposed scenario for the Design Decision Lab", suggests: "practice" },
  { id: "workplace", label: "A reflection on how the philosophy applies in a workplace or community", suggests: "practice" },
  { id: "withdrawal", label: "A request to correct or withdraw something", suggests: "question" },
] as const satisfies readonly { id: string; label: string; suggests: EntryType }[]

export type ContributionKind = (typeof CONTRIBUTION_KINDS)[number]["id"]

export const ATTRIBUTION_MODES = [
  { id: "name", label: "My name", hint: "Shown as you write it." },
  { id: "role", label: "My role or community only", hint: "For example, 'A mentor in Chicago'." },
  { id: "anonymous", label: "Anonymous", hint: "Shown as 'A community member'." },
] as const

export type AttributionMode = (typeof ATTRIBUTION_MODES)[number]["id"]

/** The seven parts of the contribution template. */
export const TEMPLATE_FIELDS = [
  { key: "context", label: "Context", prompt: "What kind of situation were you working in? Share only information you have permission to disclose." },
  { key: "challenge", label: "Challenge", prompt: "What decision, tension, or problem did you face?" },
  { key: "tried", label: "What you tried", prompt: "What approach did you take, and why?" },
  { key: "learned", label: "What you learned", prompt: "What happened? What assumptions were challenged? Whose perspectives changed your thinking?" },
  { key: "change", label: "What you would change", prompt: "What would you do differently next time?" },
  { key: "takeaway", label: "What others can take away", prompt: "What is the transferable lesson, and in what contexts might it not apply?" },
] as const

export type TemplateKey = (typeof TEMPLATE_FIELDS)[number]["key"]

/** What a steward checks before publishing (MD: relevance, consent, privacy, accessibility, alignment). */
export const REVIEW_CHECKS = [
  { id: "relevance", label: "Relevance", question: "Does it help people understand or practice the philosophy?" },
  { id: "consent", label: "Consent", question: "Does everyone described or quoted appear with their permission?" },
  { id: "privacy", label: "Privacy", question: "Is it free of personal or confidential details (names, contacts, identifying stories)?" },
  { id: "accessibility", label: "Accessibility", question: "Is it in plain, inclusive language, with text alternatives for anything visual?" },
  { id: "alignment", label: "Alignment", question: "Is it consistent with the philosophy, and labelled so it isn't mistaken for core guidance?" },
] as const

export type ReviewCheckId = (typeof REVIEW_CHECKS)[number]["id"]

export type Status = "submitted" | "in-discussion" | "published" | "declined"

export type Reply = { id: string; from: "steward" | "contributor"; text: string; at: string }

export type HistoryItem = { at: string; by: string; action: string; version: string }

export type Entry = {
  id: string
  type: EntryType
  kind?: ContributionKind
  title: string
  fields: Partial<Record<TemplateKey, string>>
  /** For core philosophy entries: BRIDGEGOOD-authored body text. */
  body?: string
  attribution: { mode: AttributionMode; as: string }
  consentConfirmed: boolean
  status: Status
  checks: Partial<Record<ReviewCheckId, boolean>>
  replies: Reply[]
  history: HistoryItem[]
  version: string
  submittedAt: string
  reviewedAt?: string
  /** A resource or scenario this entry relates to. */
  related?: { kind: "resource" | "scenario"; slug: string }
  /** Recurring theme tags the steward adds, used to improve resources. */
  themes: string[]
  /** Set on contributions made in this browser, so the demo can show "your contributions". */
  mine?: boolean
  declineReason?: string
}

const core = (id: string, title: string, body: string): Entry => ({
  id,
  type: "core",
  title,
  body,
  fields: {},
  attribution: { mode: "name", as: "BRIDGEGOOD" },
  consentConfirmed: true,
  status: "published",
  checks: {},
  replies: [],
  history: [{ at: "Sep 2026", by: "BRIDGEGOOD", action: "Published", version: "1.0" }],
  version: "1.0",
  submittedAt: "Sep 2026",
  reviewedAt: "Sep 2026",
  themes: [],
})

const community = (e: Omit<Entry, "status" | "checks" | "replies" | "consentConfirmed" | "history" | "version"> & { version?: string }): Entry => ({
  status: "published",
  consentConfirmed: true,
  checks: { relevance: true, consent: true, privacy: true, accessibility: true, alignment: true },
  replies: [],
  version: e.version ?? "1.0",
  history: [
    { at: e.submittedAt, by: e.attribution.as, action: "Submitted", version: "0.1" },
    { at: e.reviewedAt ?? e.submittedAt, by: "Morgan Ellis (steward)", action: "Reviewed and published", version: e.version ?? "1.0" },
  ],
  ...e,
})

export const SEED_ENTRIES: Entry[] = [
  core(
    "core-feedback-responsibility",
    "Feedback is a responsibility, not a formality",
    "When people take the time to tell us what isn't working, we owe them a response: what we changed, or why we didn't. Collecting feedback that changes nothing teaches people not to give it. This applies to participants, partners, mentors and BRIDGEGOOD itself."
  ),
  core(
    "core-many-successes",
    "There is more than one definition of success",
    "BRIDGEGOOD helps people make informed career decisions instead of pushing everyone toward the same definition of success. Mentors share their real paths, including detours, and avoid steering people toward the path they took."
  ),
  community({
    id: "pe-phone-booking",
    type: "practice",
    kind: "lesson",
    title: "We almost built an app nobody needed",
    fields: {
      context: "A student team redesigning appointment booking for a neighborhood benefits office (synthetic example).",
      challenge: "The brief asked for a mobile app. Listening sessions showed many residents book on behalf of neighbors, by phone.",
      tried: "We paused the app and piloted a text-message booking flow with a callback option.",
      learned: "Our assumption that 'everyone has a smartphone' came from our own lives. Older residents' perspectives changed our whole direction.",
      change: "Hold listening sessions before writing any brief, not after.",
      takeaway: "Ask who books for whom. It may not apply where services are strictly personal, such as health records.",
    },
    attribution: { mode: "role", as: "A student team, Oakland" },
    submittedAt: "Sep 2026",
    reviewedAt: "Sep 2026",
    related: { kind: "scenario", slug: "community-service-redesign" },
    themes: ["access", "assumptions"],
  }),
  community({
    id: "la-interview-guide-dari",
    type: "adaptation",
    kind: "adaptation",
    title: "Adapting the interview guide for Dari-speaking families",
    fields: {
      context: "A chapter working with a refugee resettlement nonprofit (synthetic example).",
      challenge: "The interview guide assumed one-to-one interviews; families preferred to talk together, with an elder present.",
      tried: "We ran family conversations with a community interpreter, and changed consent to be explained aloud to the whole family.",
      learned: "The guide's intent (consent, listening, following their story) held. The format had to change.",
      change: "Ask the partner how people prefer to talk before choosing a format.",
      takeaway: "Change format, not intent. This may not suit topics people wouldn't discuss in front of family.",
    },
    attribution: { mode: "role", as: "A chapter lead, Toronto" },
    submittedAt: "Oct 2026",
    reviewedAt: "Oct 2026",
    related: { kind: "resource", slug: "community-interview-guide" },
    themes: ["language", "consent"],
  }),
  community({
    id: "oq-paying-participants",
    type: "question",
    kind: "question",
    title: "How should small chapters pay participants when there's no budget?",
    fields: {
      context: "A new chapter with volunteer leads and no funding yet (synthetic example).",
      challenge: "The guidance says pay people for their time, but we have no budget. Should we wait, or run unpaid sessions?",
      takeaway: "We'd like to hear how other chapters handled this, and what BRIDGEGOOD recommends.",
    },
    attribution: { mode: "anonymous", as: "A community member" },
    submittedAt: "Oct 2026",
    reviewedAt: "Oct 2026",
    related: { kind: "resource", slug: "listening-session-planner" },
    themes: ["access", "funding"],
  }),
  community({
    id: "pe-workplace-a11y",
    type: "practice",
    kind: "workplace",
    title: "Bringing 'make room for every voice' into sprint reviews",
    fields: {
      context: "A product team at a company that hosts mentors (synthetic example).",
      challenge: "Sprint reviews only included the team and stakeholders, never the people using the product.",
      tried: "We invited two customers who use assistive technology to each review, and paid them.",
      learned: "Accessibility issues surfaced weeks earlier, and the team's language about 'edge cases' changed.",
      change: "Start sooner, and rotate who we invite so it isn't always the same two people.",
      takeaway: "Pay people and invite them regularly. It doesn't replace proper accessibility testing.",
    },
    attribution: { mode: "role", as: "A company host, fintech" },
    submittedAt: "Oct 2026",
    reviewedAt: "Oct 2026",
    related: { kind: "scenario", slug: "limited-budget-unequal-access" },
    themes: ["access", "workplace"],
  }),
  {
    id: "sub-critique-norms",
    type: "practice",
    kind: "lesson",
    title: "Agreeing critique norms before the first critique",
    fields: {
      context: "A mentor supporting a student team (synthetic example).",
      challenge: "A comment in critique silenced a student whose idea came from their own family's experience.",
      tried: "I checked in privately, then the team agreed critique norms together.",
      learned: "Students wanted norms from day one but didn't feel able to ask.",
      change: "Set norms in the first session.",
      takeaway: "Agree how you'll critique before you critique.",
    },
    attribution: { mode: "role", as: "A mentor, Chicago" },
    consentConfirmed: true,
    status: "submitted",
    checks: {},
    replies: [],
    history: [{ at: "Oct 2026", by: "A mentor, Chicago", action: "Submitted", version: "0.1" }],
    version: "0.1",
    submittedAt: "Oct 2026",
    related: { kind: "scenario", slug: "team-conflict-trust" },
    themes: [],
  },
]

export const entryTypeInfo = (type: EntryType) => ENTRY_TYPES.find((t) => t.id === type)!
