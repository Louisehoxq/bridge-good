import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { SEED_CHANGELOG, SEED_DISAGREEMENTS, SEED_FEEDBACK, SEED_FIELD_NOTES } from "../../../content/feedback-seed"
import { FRAMEWORK_META, getPillar } from "../../../content/framework"
import { CURRENT_PUBLISHED, FRAMEWORK_VERSIONS } from "../../../content/framework-history"
import {
  addReply,
  allowedEffects,
  changeWording,
  compareVersions,
  currentVersion,
  decide,
  DecisionError,
  nextVersion,
  officialWording,
  openDisagreementGroups,
  type DecisionContext,
} from "../logic"
import type { AdaptationFeedback, DidntFitFeedback, FeedbackItem, WordingVersion } from "../types"

// Synthetic examples only: no real participants.
let n = 0
const ctx = (over: Partial<DecisionContext> = {}): DecisionContext => ({
  by: "steward",
  byName: "Morgan Ellis, BRIDGEGOOD steward",
  now: "Oct 25, 2026",
  newId: () => `id-${++n}`,
  version: "0.1",
  ...over,
})

const adaptation = (over: Partial<AdaptationFeedback> = {}): AdaptationFeedback => ({
  ...(SEED_FEEDBACK.find((f) => f.id === "fb-houston-languages") as AdaptationFeedback),
  ...over,
})

const flag: DidntFitFeedback = SEED_FEEDBACK.find((f) => f.id === "fb-prompt-in-the-room") as DidntFitFeedback

function expectError(fn: () => unknown, field: DecisionError["field"]) {
  assert.throws(fn, (err) => err instanceof DecisionError && err.field === field)
}

describe("framework versions", () => {
  it("history ends at the version in framework.ts", () => {
    assert.equal(CURRENT_PUBLISHED.version, FRAMEWORK_META.version)
    assert.ok(FRAMEWORK_VERSIONS.every((v, i, all) => i === 0 || compareVersions(v.version, all[i - 1].version) > 0), "versions go up")
  })

  it("compares and bumps versions numerically", () => {
    assert.ok(compareVersions("0.10", "0.9") > 0)
    assert.equal(compareVersions("0.2", "0.2.0"), 0)
    assert.equal(nextVersion("0.1"), "0.2")
    assert.equal(nextVersion("0.9"), "0.10")
  })

  it("uses the newest wording for a pillar, and the published one otherwise", () => {
    const wordings: WordingVersion[] = [
      { id: "w1", pillarId: "craft", version: "0.2", meaning: "Second", at: "", changelogId: "c1" },
      { id: "w2", pillarId: "craft", version: "0.3", meaning: "Third", at: "", changelogId: "c2" },
    ]
    assert.deepEqual(officialWording("craft", wordings), { text: "Third", version: "0.3" })
    assert.deepEqual(officialWording("ethics-impact", wordings), { text: getPillar("ethics-impact").meaning, version: undefined })
    assert.equal(currentVersion("0.1", wordings), "0.3")
    assert.equal(currentVersion("0.1", []), "0.1")
  })
})

describe("decisions", () => {
  it("only lets a steward decide", () => {
    expectError(() => decide(adaptation(), { outcome: "declined", reason: "No" }, ctx({ by: "ambassador" })), "by")
    expectError(() => changeWording("craft", { text: "New", reason: "Why" }, ctx({ by: "mentor" })), "by")
  })

  it("always needs a reason", () => {
    expectError(() => decide(adaptation(), { outcome: "declined", reason: "  " }, ctx()), "reason")
    expectError(() => decide(adaptation(), { outcome: "accepted", reason: "", effect: "field-note", text: "x" }, ctx()), "reason")
  })

  it("declines without publishing anything", () => {
    const result = decide(adaptation(), { outcome: "declined", reason: "It changes a core commitment." }, ctx())
    assert.equal(result.item.status, "declined")
    assert.equal(result.item.decision?.reason, "It changes a core commitment.")
    assert.equal(result.changelog, undefined)
  })

  it("turns an accepted adaptation into a field note without a new version", () => {
    const item = adaptation({ credit: { consent: true, as: "Houston chapter" } })
    const result = decide(item, { outcome: "accepted", reason: "Removes a barrier.", effect: "field-note", text: "We book interpreters." }, ctx())
    assert.equal(result.item.status, "accepted")
    assert.equal(result.fieldNote?.chapter, "Houston chapter")
    assert.equal(result.fieldNote?.pillarId, "access-inclusion")
    assert.equal(result.changelog?.type, "field-note")
    assert.equal(result.changelog?.version, "0.1")
    assert.equal(result.changelog?.credit, "Houston chapter")
    assert.equal(result.item.decision?.changelogId, result.changelog?.id)
  })

  it("credits only with consent", () => {
    const result = decide(adaptation(), { outcome: "accepted", reason: "Fair.", effect: "field-note", text: "Note" }, ctx())
    assert.equal(result.changelog?.credit, undefined)
    assert.equal(result.fieldNote?.credit, undefined)
    assert.doesNotMatch(JSON.stringify(result.changelog), /Marcus Bell/)
  })

  it("publishes a new version when the wording changes, with before and after", () => {
    const result = decide(
      adaptation(),
      { outcome: "accepted", reason: "Interpreters belong in the core.", effect: "wording", text: "New meaning." },
      ctx({ currentWording: "Old meaning." })
    )
    assert.equal(result.wording?.version, "0.2")
    assert.equal(result.changelog?.version, "0.2")
    assert.equal(result.changelog?.before, "Old meaning.")
    assert.equal(result.changelog?.after, "New meaning.")
    expectError(
      () => decide(adaptation(), { outcome: "accepted", reason: "Same", effect: "wording", text: "Old meaning." }, ctx({ currentWording: "Old meaning." })),
      "text"
    )
  })

  it("only offers effects that fit the item", () => {
    assert.deepEqual(allowedEffects(adaptation()), ["field-note", "wording"])
    assert.deepEqual(allowedEffects(flag), ["noted"])
    expectError(() => decide(flag, { outcome: "accepted", reason: "Yes", effect: "field-note", text: "x" }, ctx()), "effect")
    expectError(() => decide(flag, { outcome: "accepted", reason: "Yes", effect: "noted" }, ctx()), "summary")
    const noted = decide(flag, { outcome: "accepted", reason: "Fair.", effect: "noted", summary: "We'll reword prompt 5." }, ctx())
    assert.equal(noted.changelog?.type, "noted")
    assert.equal(noted.changelog?.source, "A “this didn’t fit” flag from an apprentice")
  })

  it("won't decide twice", () => {
    const done = SEED_FEEDBACK.find((f) => f.status === "accepted") as FeedbackItem
    expectError(() => decide(done, { outcome: "declined", reason: "Changed my mind" }, ctx()), "status")
  })

  it("moves an item into conversation when the steward replies", () => {
    const replied = addReply(adaptation(), { id: "r", from: "steward", text: "Which languages?", at: "now" })
    assert.equal(replied.status, "in-conversation")
    assert.equal(replied.replies.length, 1)
  })
})

describe("AI disagreement counts", () => {
  it("groups uncovered records by pillar, counts only", () => {
    const groups = openDisagreementGroups(SEED_DISAGREEMENTS, [])
    const ai = groups.find((g) => g.id === "ai-responsible-ai")!
    assert.equal(ai.total, 6)
    assert.deepEqual(ai.byLens, { student: 4, mentor: 2 })
    assert.equal(ai.byReason["Misses context"], 4)
    assert.equal(ai.from.name, undefined)
  })

  it("stops counting records a decision covered", () => {
    const [first] = openDisagreementGroups(SEED_DISAGREEMENTS, [])
    const decided = decide(first, { outcome: "accepted", reason: "Fair.", effect: "noted", summary: "Rewrite the rubric note." }, ctx()).item
    const after = openDisagreementGroups(SEED_DISAGREEMENTS, [decided])
    assert.equal(after.find((g) => g.id === first.id), undefined)
  })
})

describe("seed data", () => {
  it("is all labelled synthetic", () => {
    for (const record of [...SEED_FEEDBACK, ...SEED_CHANGELOG, ...SEED_FIELD_NOTES, ...SEED_DISAGREEMENTS]) assert.equal(record.synthetic, true, record.id)
  })

  it("credits only senders who consented", () => {
    for (const entry of SEED_CHANGELOG) {
      const source = SEED_FEEDBACK.find((f) => f.id === entry.feedbackId)
      if (entry.credit) assert.ok(source?.credit.consent && source.credit.as === entry.credit, entry.id)
    }
  })

  it("holds no email addresses or phone numbers", () => {
    assert.doesNotMatch(JSON.stringify([SEED_FEEDBACK, SEED_CHANGELOG, SEED_FIELD_NOTES]), /@|\d{3}[\s.-]\d{3}[\s.-]\d{4}/)
  })
})
