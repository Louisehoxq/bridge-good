import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { SEED_ENTRIES } from "@/content/playbook"
import { addReply, allChecksPassed, containsContactDetails, createEntry, decline, publish, recurringThemes, validateDraft, type Draft } from "@/lib/playbook"

const draft = (over: Partial<Draft> = {}): Draft => ({
  kind: "lesson",
  title: "A lesson",
  fields: { context: "A chapter project", challenge: "We assumed everyone had smartphones" },
  attributionMode: "role",
  attributionAs: "A mentor in Chicago",
  consent: true,
  ...over,
})

describe("validateDraft", () => {
  it("accepts a complete draft", () => {
    assert.deepEqual(validateDraft(draft()), [])
  })
  it("requires consent, a kind, a title, context and a challenge", () => {
    const fields = validateDraft(draft({ kind: "", title: " ", fields: {}, consent: false })).map((e) => e.field)
    assert.deepEqual(fields.sort(), ["challenge", "consent", "context", "kind", "title"])
  })
  it("needs a credit unless anonymous", () => {
    assert.equal(validateDraft(draft({ attributionAs: "" }))[0]?.field, "attributionAs")
    assert.deepEqual(validateDraft(draft({ attributionMode: "anonymous", attributionAs: "" })), [])
  })
  it("rejects contact details anywhere", () => {
    assert.ok(containsContactDetails("reach me at sam@example.org"))
    assert.ok(containsContactDetails("call 415 555 0100"))
    assert.ok(validateDraft(draft({ fields: { context: "email sam@example.org", challenge: "x" } })).length > 0)
  })
})

describe("review workflow", () => {
  const entry = createEntry(draft(), "e1", "Mon")

  it("creates a submitted, community-labelled entry", () => {
    assert.equal(entry.status, "submitted")
    assert.equal(entry.type, "practice")
    assert.equal(entry.version, "0.1")
    assert.equal(entry.mine, true)
  })
  it("labels anonymous contributions as a community member", () => {
    assert.equal(createEntry(draft({ attributionMode: "anonymous" }), "e2", "Mon").attribution.as, "A community member")
  })
  it("moves to discussion when a steward replies", () => {
    assert.equal(addReply(entry, "steward", "Can you say more?", "r1", "Tue", "Steward").status, "in-discussion")
  })
  it("won't publish until every check passes", () => {
    assert.throws(() => publish(entry, "practice", "Wed", "Steward"))
    const checked = { ...entry, checks: { relevance: true, consent: true, privacy: true, accessibility: true, alignment: true } }
    assert.ok(allChecksPassed(checked))
    const published = publish(checked, "adaptation", "Wed", "Steward")
    assert.equal(published.status, "published")
    assert.equal(published.type, "adaptation")
    assert.equal(published.version, "1.0")
    assert.equal(publish(published, "adaptation", "Thu", "Steward").version, "1.1")
  })
  it("needs a reason to decline", () => {
    assert.throws(() => decline(entry, " ", "Wed", "Steward"))
    assert.equal(decline(entry, "Contains identifying details", "Wed", "Steward").status, "declined")
  })
})

describe("recurringThemes", () => {
  it("counts themes across published community entries, most frequent first", () => {
    const themes = recurringThemes(SEED_ENTRIES)
    assert.equal(themes[0]?.theme, "access")
    assert.ok(themes.every((t, i, all) => i === 0 || all[i - 1].count >= t.count))
  })
})
