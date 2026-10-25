import type { ChangelogEntry, DisagreementRecord, FeedbackItem, FieldNoteRecord } from "@/lib/feedback/types"

/**
 * SYNTHETIC seed data for the feedback loop. No real people, chapters, partners or survey results:
 * the chapters come from the proposed chapter model in chapters.ts, and every record carries
 * `synthetic: true` so the UI labels it "Synthetic example".
 */

const STEWARD = "Morgan Ellis, BRIDGEGOOD steward"

export const SEED_FEEDBACK: FeedbackItem[] = [
  {
    id: "fb-oakland-pay",
    kind: "adaptation",
    at: "Oct 14, 2026",
    from: { role: "chapter-lead", name: "Rosa Delgado", group: "Oakland chapter" },
    chapter: "Oakland chapter",
    target: { type: "pillar", id: "design-for-good" },
    pillarIds: ["design-for-good"],
    changed: "We pay community members for interview time with gift cards for the neighborhood food co-op, not bank transfers.",
    why: "Many of the people we interview don't have a bank account, so a transfer meant waiting or paying a check-cashing fee.",
    kept: "Community members still help define the problem and judge the result, and they're paid for that time.",
    happened: "Twice as many people came back for the second round of testing.",
    ask: "local",
    credit: { consent: true, as: "Oakland chapter" },
    status: "accepted",
    decision: {
      outcome: "accepted",
      reason:
        "This keeps the core commitment (people are paid for their time) and removes a barrier that's specific to the neighborhood. Other chapters can learn from it, so we're showing it on the pillar page.",
      at: "Oct 16, 2026",
      by: STEWARD,
      effect: "field-note",
      changelogId: "cl-oakland-pay",
    },
    replies: [],
    synthetic: true,
  },
  {
    id: "fb-houston-languages",
    kind: "adaptation",
    at: "Oct 21, 2026",
    from: { role: "chapter-lead", name: "Marcus Bell", group: "Houston chapter" },
    chapter: "Houston chapter",
    target: { type: "pillar", id: "access-inclusion" },
    pillarIds: ["access-inclusion"],
    changed: "We book a trained interpreter for every community session, and we write all session materials in plain language first, then translate them.",
    why: "Our partners serve families who speak Spanish, Vietnamese and Arabic. Translating dense English didn't work: people understood the words but not the questions.",
    kept: "WCAG 2.2 AA stays the minimum. The people most likely to be left out still help decide what gets built.",
    happened: "Families answered in more detail, and two partners asked to keep the plain-language versions.",
    ask: "core",
    credit: { consent: false },
    status: "new",
    replies: [],
    synthetic: true,
  },
  {
    id: "fb-melbourne-facilitators",
    kind: "adaptation",
    at: "Oct 22, 2026",
    from: { role: "chapter-lead", name: "Liam O'Connor", group: "Melbourne chapter" },
    chapter: "Melbourne chapter",
    target: { type: "pillar", id: "access-inclusion" },
    pillarIds: ["access-inclusion"],
    changed: "Disabled community members co-lead our testing sessions as paid facilitators, instead of only taking part as testers.",
    why: "Testers told us they could see problems the team missed, but had no say in what happened next.",
    kept: "The team still tests with screen readers and older phones, and fixes what they find.",
    happened: "The facilitators changed which problems the team fixed first.",
    ask: "local",
    credit: { consent: true, as: "Melbourne chapter" },
    status: "new",
    replies: [],
    synthetic: true,
  },
  {
    id: "fb-prompt-in-the-room",
    kind: "didnt-fit",
    at: "Oct 19, 2026",
    from: { role: "apprentice" },
    target: { type: "prompt", id: 5 },
    pillarIds: ["design-for-good", "access-inclusion"],
    note: "Our team meets online and some of us keep cameras off. \"In the room\" made it sound like we had to share things about ourselves we didn't want to.",
    credit: { consent: false },
    status: "new",
    replies: [],
    synthetic: true,
  },
  {
    id: "fb-guide-mock-case",
    kind: "didnt-fit",
    at: "Oct 18, 2026",
    from: { role: "mentor" },
    target: { type: "guide", id: "mock-case" },
    pillarIds: ["design-for-good", "craft"],
    note: "The guide plans for four weeks. Our evening cohort runs over six, so the weekly steps don't line up.",
    credit: { consent: false },
    status: "in-conversation",
    replies: [
      {
        id: "r-guide-1",
        from: "steward",
        text: "Thanks. Which steps felt rushed when you stretched them over six weeks? We'd like to know before we change the guide.",
        at: "Oct 20, 2026",
      },
    ],
    synthetic: true,
  },
  {
    id: "fb-craft-portfolio",
    kind: "didnt-fit",
    at: "Oct 12, 2026",
    from: { role: "apprentice" },
    target: { type: "pillar", id: "craft" },
    pillarIds: ["craft"],
    note: "It sounds like the portfolio doesn't matter. I need a job after this.",
    credit: { consent: false },
    status: "declined",
    decision: {
      outcome: "declined",
      reason:
        "We're keeping \"not only the portfolio\": in the spring reflections, apprentices said portfolio pressure crowded out what the community needed. Your point is fair, though. The portfolio does matter, and we'll add an example showing work that serves both.",
      at: "Oct 15, 2026",
      by: STEWARD,
    },
    replies: [],
    synthetic: true,
  },
  {
    id: "fb-retro-pantry",
    kind: "retrospective",
    at: "Oct 17, 2026",
    from: { role: "community-partner", name: "Northside Food Pantry", group: "Northside Food Pantry" },
    target: { type: "project", id: "pantry-text-booking" },
    pillarIds: ["design-for-good"],
    project: "Text-message booking for a food pantry",
    worked: "Visitors tested the text booking twice before launch, and the team changed the wording both times.",
    didnt: "The sprint weeks clashed with our busiest distribution days, so we missed two check-ins.",
    change: "Ask partners for their busy weeks before setting the sprint calendar.",
    communityRole: "shaped",
    credit: { consent: true, as: "Northside Food Pantry" },
    status: "new",
    replies: [],
    synthetic: true,
  },
  {
    id: "fb-community-spring",
    kind: "community",
    at: "Oct 10, 2026",
    from: {},
    target: { type: "framework" },
    pillarIds: ["design-for-good", "access-inclusion", "responsible-ai"],
    source: "End-of-cohort reflections, spring cohort, all chapters",
    responses: 46,
    themes: [
      { theme: "Critiques felt safer when the apprentice spoke first", count: 19, pillarId: "design-for-good" },
      { theme: "Wanted more time with accessibility testing tools", count: 14, pillarId: "access-inclusion" },
      { theme: "Unsure when using AI needs to be disclosed", count: 11, pillarId: "responsible-ai" },
      { theme: "Evening sessions made it possible to take part around work", count: 9 },
    ],
    credit: { consent: false },
    status: "new",
    replies: [],
    synthetic: true,
  },
]

/** "Not right" records from AI feedback controls (Reflection Companion and mentor critique prep). Counts only. */
const RECORDS: Omit<DisagreementRecord, "rubricVersion">[] = [
  ...Array.from({ length: 4 }, (_, i) => ({ id: `dis-ai-ctx-${i}`, pillar: "responsible-ai" as const, lens: "student" as const, reason: "Misses context" })),
  ...Array.from({ length: 2 }, (_, i) => ({ id: `dis-ai-stage-${i}`, pillar: "responsible-ai" as const, lens: "mentor" as const, reason: "Not relevant to this stage" })),
  ...Array.from({ length: 3 }, (_, i) => ({ id: `dis-access-culture-${i}`, pillar: "access-inclusion" as const, lens: "mentor" as const, reason: "Culturally off" })),
  { id: "dis-access-tone-0", pillar: "access-inclusion", lens: "student", reason: "Tone felt harsh" },
]

export const SEED_DISAGREEMENTS: DisagreementRecord[] = RECORDS.map((r): DisagreementRecord => ({ ...r, rubricVersion: "0.1-draft", synthetic: true }))

export const SEED_CHANGELOG: ChangelogEntry[] = [
  {
    id: "cl-oakland-pay",
    at: "Oct 16, 2026",
    version: "0.1",
    type: "field-note",
    title: "Field note: paying community members without a bank account",
    summary: "Recognized as a local variant on the Design for Good pillar: paying for interview time with food co-op gift cards.",
    reason:
      "This keeps the core commitment (people are paid for their time) and removes a barrier that's specific to the neighborhood. Other chapters can learn from it, so we're showing it on the pillar page.",
    target: { type: "pillar", id: "design-for-good" },
    source: "Local adaptation from the Oakland chapter",
    credit: "Oakland chapter",
    feedbackId: "fb-oakland-pay",
    synthetic: true,
  },
]

export const SEED_FIELD_NOTES: FieldNoteRecord[] = [
  {
    id: "fn-oakland-pay",
    pillarId: "design-for-good",
    chapter: "Oakland chapter",
    text: "We pay community members for interview time with gift cards for the neighborhood food co-op, because many people we interview don't have a bank account. Twice as many came back for the second round.",
    version: "0.1",
    at: "Oct 16, 2026",
    changelogId: "cl-oakland-pay",
    credit: "Oakland chapter",
    synthetic: true,
  },
]
