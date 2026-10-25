import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { EVENT_TYPE_INFO, SEED_EVENTS, SEED_RSVPS } from "../../../content/events"
import { KIT } from "../../../content/carry-forward"
import { getChapter } from "../../../content/chapters"
import { SEED_FEEDBACK } from "../../../content/feedback-seed"
import { itemTitle, sourceLabel, targetHref } from "../../feedback/logic"
import {
  addDays,
  canHost,
  eventDay,
  eventFromDraft,
  formatTimes,
  goingCount,
  hasEnded,
  looksLikeAddress,
  parseLanguages,
  past,
  spotsLeft,
  toIcs,
  todayFrom,
  upcoming,
  validateDraft,
  yourUpcoming,
  zonedToUtc,
  type EventDraft,
} from "../logic"
import { EVENT_TYPES, type CommunityEvent } from "../types"

// Synthetic examples only: no real people, places or events.
const NOW = Date.parse("2026-10-25T15:00:00Z")
const TODAY = todayFrom(NOW)

const draft = (over: Partial<EventDraft> = {}): EventDraft => ({
  type: "critique-circle",
  title: "Critique circle: the rent relief form",
  summary: "We critique a draft form with tenants in the room.",
  chapterId: "chicago",
  date: "2026-11-08",
  start: "18:00",
  end: "19:00",
  format: "in-person",
  area: "Little Village, a community center",
  stepFree: "yes",
  stepFreeNote: "",
  captions: "no",
  languages: "English, Spanish",
  childcare: "yes",
  accessNote: "",
  capacity: "12",
  forRoles: ["apprentice", "mentor"],
  ...over,
})

const seed = (id: string) => SEED_EVENTS.find((e) => e.id === id) as CommunityEvent

describe("dates and time zones", () => {
  it("counts seed days from today and keeps fixed dates", () => {
    assert.equal(addDays("2026-10-25", 9), "2026-11-03")
    assert.equal(addDays("2026-10-25", -6), "2026-10-19")
    assert.equal(eventDay({ inDays: 9 }, TODAY), "2026-11-03")
    assert.equal(eventDay({ date: "2026-12-01" }, TODAY), "2026-12-01")
  })

  it("turns wall-clock times into the right instant, across daylight saving", () => {
    // Chicago is UTC-5 in October (daylight time) and UTC-6 after November 1.
    assert.equal(new Date(zonedToUtc("2026-10-20", "18:00", "America/Chicago")).toISOString(), "2026-10-20T23:00:00.000Z")
    assert.equal(new Date(zonedToUtc("2026-11-08", "18:00", "America/Chicago")).toISOString(), "2026-11-09T00:00:00.000Z")
    assert.equal(new Date(zonedToUtc("2026-11-08", "10:00", "Asia/Singapore")).toISOString(), "2026-11-08T02:00:00.000Z")
  })

  it("labels times with the chapter's city, the same on server and browser", () => {
    assert.match(formatTimes(seed("ev-london-critique"), TODAY), /^6:00 PM – 7:15 PM London time$/)
  })

  it("splits upcoming and past, soonest and most recent first", () => {
    const next = upcoming(SEED_EVENTS, NOW)
    const before = past(SEED_EVENTS, NOW)
    assert.equal(next.length + before.length, SEED_EVENTS.length)
    assert.deepEqual(
      before.map((e) => e.id),
      ["ev-chicago-critique-past", "ev-oakland-listening-past"]
    )
    assert.equal(next[0].id, "ev-online-portfolio-mentor")
  })

  it("treats the demo's 'pretend it happened' as ended", () => {
    const event = { ...seed("ev-chicago-critique"), demoEnded: true }
    assert.equal(hasEnded(seed("ev-chicago-critique"), NOW), false)
    assert.equal(hasEnded(event, NOW), true)
  })
})

describe("hosting and RSVPs", () => {
  it("lets chapter leads, company hosts, partners and mentors host, but not apprentices", () => {
    assert.equal(canHost("chapter-lead"), true)
    assert.equal(canHost("company-host"), true)
    assert.equal(canHost("community-partner"), true)
    assert.equal(canHost("mentor"), true)
    assert.equal(canHost("apprentice"), false)
    assert.equal(canHost(undefined), false)
  })

  it("counts synthetic and demo RSVPs, without going below zero spots", () => {
    const event = seed("ev-chicago-critique")
    assert.equal(goingCount(event, SEED_RSVPS), 8)
    assert.equal(spotsLeft(event, SEED_RSVPS), 4)
    const full = { ...event, capacity: 5 }
    assert.equal(spotsLeft(full, SEED_RSVPS), 0)
  })

  it("lists what you host and what you're going to", () => {
    const priya = yourUpcoming(SEED_EVENTS, SEED_RSVPS, { role: "chapter-lead", name: "Priya Raman" }, NOW)
    assert.deepEqual(
      priya.map((e) => e.id),
      ["ev-chicago-critique"]
    )
    const ari = yourUpcoming(SEED_EVENTS, SEED_RSVPS, { role: "apprentice", name: "Ari Santos" }, NOW)
    assert.deepEqual(
      ari.map((e) => e.id),
      ["ev-chicago-portfolio"]
    )
  })
})

describe("the host form", () => {
  it("accepts a complete draft", () => {
    assert.deepEqual(validateDraft(draft(), TODAY), {})
  })

  it("requires every access detail", () => {
    const errors = validateDraft(draft({ stepFree: "", captions: "", childcare: "", languages: " , " }), TODAY)
    assert.ok(errors.stepFree && errors.captions && errors.childcare && errors.languages)
  })

  it("asks what isn't step-free when it's only partly step-free", () => {
    assert.ok(validateDraft(draft({ stepFree: "partly" }), TODAY).stepFreeNote)
    assert.deepEqual(validateDraft(draft({ stepFree: "partly", stepFreeNote: "Restroom up three steps." }), TODAY), {})
  })

  it("takes an area, never a street address", () => {
    assert.equal(looksLikeAddress("1234 W 18th St"), true)
    assert.equal(looksLikeAddress("12 High Street"), true)
    assert.equal(looksLikeAddress("Pilsen, a library community room"), false)
    assert.equal(looksLikeAddress("Third Ward, 2nd floor"), false)
    assert.ok(validateDraft(draft({ area: "1234 W 18th St" }), TODAY).area)
    assert.equal(validateDraft(draft({ format: "online", area: "" }), TODAY).area, undefined)
  })

  it("screens free text for email addresses and phone numbers", () => {
    assert.ok(validateDraft(draft({ summary: "Questions? Call 312-555-0142." }), TODAY).summary)
    assert.ok(validateDraft(draft({ accessNote: "Email host@example.org" }), TODAY).accessNote)
  })

  it("checks dates, times and size", () => {
    assert.ok(validateDraft(draft({ date: "2026-10-01" }), TODAY).date)
    assert.ok(validateDraft(draft({ end: "17:00" }), TODAY).end)
    assert.ok(validateDraft(draft({ capacity: "1" }), TODAY).capacity)
    assert.ok(validateDraft(draft({ capacity: "12.5" }), TODAY).capacity)
    assert.ok(validateDraft(draft({ forRoles: [] }), TODAY).forRoles)
    assert.ok(validateDraft(draft({ chapterId: "atlantis" }), TODAY).chapterId)
  })

  it("builds the event from the draft and the template, always free, in the chapter's time zone", () => {
    const event = eventFromDraft(draft({ languages: "English, Spanish, English" }), { id: "ev-test", host: { role: "chapter-lead", name: "Priya Raman" } })
    assert.equal(event.timeZone, getChapter("chicago")!.timeZone)
    assert.equal(event.access.cost, "free")
    assert.deepEqual(event.access.languages, ["English", "Spanish"])
    assert.equal(event.links.kit, true)
    assert.equal(event.agenda.length, KIT.steps.length)
    assert.equal(eventFromDraft(draft({ format: "online" }), { id: "x", host: { role: "mentor", name: "Jordan Lee" } }).area, undefined)
  })

  it("parses languages from commas, semicolons or lines", () => {
    assert.deepEqual(parseLanguages("English; Spanish\nASL, "), ["English", "Spanish", "ASL"])
  })
})

describe("templates and seeds", () => {
  it("has a template for every type, and the critique circle follows the kit", () => {
    for (const type of EVENT_TYPES) assert.ok(EVENT_TYPE_INFO[type].template.agenda.length > 0, type)
    const circle = EVENT_TYPE_INFO["critique-circle"].template
    assert.deepEqual(
      circle.agenda.map((s) => s.title),
      KIT.steps.map((s) => s.title)
    )
    assert.equal(circle.minutes, 60)
  })

  it("marks every seed as synthetic, with access details, an area not an address, and a real chapter", () => {
    for (const e of SEED_EVENTS) {
      assert.equal(e.synthetic, true, e.id)
      assert.equal(e.access.cost, "free", e.id)
      assert.ok(e.access.languages.length > 0, e.id)
      assert.ok(getChapter(e.chapterId), e.id)
      if (e.format === "in-person") assert.ok(e.area && !looksLikeAddress(e.area), e.id)
      if (e.access.stepFree !== "yes") assert.ok(e.access.stepFreeNote, e.id)
    }
  })
})

describe("the calendar file", () => {
  it("writes a valid VEVENT in UTC, with CRLF lines and escaped text", () => {
    const ics = toIcs(seed("ev-chicago-critique"), NOW)
    assert.match(ics, /^BEGIN:VCALENDAR\r\n/)
    assert.match(ics, /\r\nDTSTART:20261104T000000Z\r\n/)
    assert.match(ics, /\r\nDTEND:20261104T010000Z\r\n/)
    assert.match(ics, /\r\nLOCATION:Pilsen\\, a public library community room\\, Chicago\r\n/)
    assert.match(ics, /END:VCALENDAR\r\n$/)
    for (const line of ics.split("\r\n")) assert.ok(line.length <= 75, line)
  })
})

describe("what we learned, in the steward inbox", () => {
  const item = SEED_FEEDBACK.find((f) => f.kind === "event-learning")!

  it("names the event and the calendar, never a person", () => {
    assert.equal(itemTitle(item), "What we learned: Listening session: finding fresh food")
    assert.equal(sourceLabel(item), "A listening session on the Oakland chapter calendar, from its host")
    assert.equal(targetHref(item.target), "/events/ev-oakland-listening-past")
  })
})
