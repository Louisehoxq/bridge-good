import type { StudioRole } from "@/components/studio/role-badge"
import { getChapter } from "@/content/chapters"
import { EVENT_TYPE_INFO } from "@/content/events"
import { findPersonalData } from "@/lib/evaluator/privacy"
import type { CommunityEvent, EventFormat, EventHost, EventType, Rsvp, StepFree } from "@/lib/events/types"
import { EVENT_TYPES, HOST_ROLES } from "@/lib/events/types"

/**
 * Community events' rules, kept free of React so they can be unit tested: dates and time zones, who can host,
 * RSVP counts, the host form's checks, and the calendar file.
 */

const DAY = 24 * 60 * 60 * 1000

// Dates and time zones -------------------------------------------------------------------------------

/** Today's date as YYYY-MM-DD in UTC. Seed events count their days from it. */
export function todayFrom(now: number) {
  return new Date(now).toISOString().slice(0, 10)
}

export function addDays(date: string, days: number) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY).toISOString().slice(0, 10)
}

/** The event's day in its own time zone, as YYYY-MM-DD. */
export function eventDay(event: Pick<CommunityEvent, "date" | "inDays">, today: string) {
  return event.date ?? addDays(today, event.inDays ?? 0)
}

/** How far a time zone is ahead of UTC at a given instant, in milliseconds. */
function zoneOffset(instant: number, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  return Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second")) - Math.floor(instant / 1000) * 1000
}

/** A wall-clock date and time in a time zone, as a UTC instant. Handles daylight saving changes. */
export function zonedToUtc(date: string, time: string, timeZone: string) {
  const [y, m, d] = date.split("-").map(Number)
  const [hh, mm] = time.split(":").map(Number)
  const wall = Date.UTC(y, m - 1, d, hh, mm)
  const first = wall - zoneOffset(wall, timeZone)
  const second = wall - zoneOffset(first, timeZone)
  return second
}

export function eventTimes(event: CommunityEvent, today: string) {
  const day = eventDay(event, today)
  return { day, start: zonedToUtc(day, event.start, event.timeZone), end: zonedToUtc(day, event.end, event.timeZone) }
}

export function hasEnded(event: CommunityEvent, now: number) {
  return !!event.demoEnded || eventTimes(event, todayFrom(now)).end <= now
}

/** Upcoming events, soonest first. */
export function upcoming(events: CommunityEvent[], now: number) {
  const today = todayFrom(now)
  return events.filter((e) => !hasEnded(e, now)).sort((a, b) => eventTimes(a, today).start - eventTimes(b, today).start)
}

/** Past events, most recent first. */
export function past(events: CommunityEvent[], now: number) {
  const today = todayFrom(now)
  return events.filter((e) => hasEnded(e, now)).sort((a, b) => eventTimes(b, today).start - eventTimes(a, today).start)
}

/** "Saturday, November 7" in the event's own time zone. */
export function formatDay(event: CommunityEvent, today: string, short = false) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: event.timeZone,
    weekday: short ? "short" : "long",
    month: short ? "short" : "long",
    day: "numeric",
  }).format(eventTimes(event, today).start)
}

/**
 * "6:00 PM – 7:00 PM Chicago time", always in the event's own time zone. Named after the chapter's city, not
 * Intl's zone names, which differ between Node and browsers and would break hydration.
 */
export function formatTimes(event: CommunityEvent, today: string) {
  const { start, end } = eventTimes(event, today)
  const time = (instant: number) => new Intl.DateTimeFormat("en-US", { timeZone: event.timeZone, hour: "numeric", minute: "2-digit" }).format(instant)
  return `${time(start)} – ${time(end)} ${zoneLabel(event.timeZone)}`
}

/** "Chicago time" for America/Chicago. */
export function zoneLabel(timeZone: string) {
  return `${timeZone.split("/").pop()!.replace(/_/g, " ")} time`
}

export function durationMinutes(start: string, end: string) {
  const mins = (t: string) => {
    const [h, m] = t.split(":").map(Number)
    return h * 60 + m
  }
  return mins(end) - mins(start)
}

export function minutesToTime(total: number) {
  const h = Math.floor(total / 60) % 24
  return `${String(h).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`
}

// Labels ---------------------------------------------------------------------------------------------

export function typeLabel(type: EventType) {
  return EVENT_TYPE_INFO[type].label
}

/** The type in the middle of a sentence: "a critique circle", but "Demo Day" keeps its capitals. */
export function typeNoun(type: EventType) {
  return type === "demo-day" ? EVENT_TYPE_INFO[type].label : EVENT_TYPE_INFO[type].label.toLowerCase()
}

export function chapterName(chapterId: string) {
  const chapter = getChapter(chapterId)
  return chapter ? `${chapter.city} chapter` : "A chapter"
}

/** "Pilsen, a public library community room, Chicago" or "Online". */
export function placeLabel(event: CommunityEvent) {
  if (event.format === "online") return "Online"
  const city = getChapter(event.chapterId)?.city
  return [event.area, city].filter(Boolean).join(", ")
}

export const FORMAT_INFO: Record<EventFormat, { label: string; icon: "map" | "monitor" }> = {
  "in-person": { label: "In person", icon: "map" },
  online: { label: "Online", icon: "monitor" },
}

export const STEP_FREE_INFO: Record<StepFree, string> = {
  yes: "Step-free throughout",
  partly: "Partly step-free",
  no: "Not step-free",
}

// Hosting and RSVPs ----------------------------------------------------------------------------------

export function canHost(role: StudioRole | undefined): boolean {
  return !!role && (HOST_ROLES as readonly string[]).includes(role)
}

export function isHost(event: CommunityEvent, who: EventHost | undefined) {
  return !!who && event.host.name === who.name && event.host.role === who.role
}

export function rsvpsFor(eventId: string, rsvps: Rsvp[]) {
  return rsvps.filter((r) => r.eventId === eventId)
}

export function goingCount(event: CommunityEvent, rsvps: Rsvp[]) {
  return (event.seedGoing ?? 0) + rsvpsFor(event.id, rsvps).length
}

export function spotsLeft(event: CommunityEvent, rsvps: Rsvp[]) {
  return Math.max(0, event.capacity - goingCount(event, rsvps))
}

export function myRsvp(eventId: string, rsvps: Rsvp[], who: EventHost | undefined) {
  return who ? rsvps.find((r) => r.eventId === eventId && r.name === who.name && r.role === who.role) : undefined
}

/** Upcoming events this person hosts or has said they're going to. */
export function yourUpcoming(events: CommunityEvent[], rsvps: Rsvp[], who: EventHost, now: number) {
  return upcoming(events, now).filter((e) => isHost(e, who) || !!myRsvp(e.id, rsvps, who))
}

// The host form --------------------------------------------------------------------------------------

/** What the "Host an event" form sends, as the person typed it. */
export type EventDraft = {
  type: EventType | ""
  title: string
  summary: string
  chapterId: string
  date: string
  start: string
  end: string
  format: EventFormat | ""
  area: string
  stepFree: StepFree | ""
  stepFreeNote: string
  captions: "yes" | "no" | ""
  languages: string
  childcare: "yes" | "no" | ""
  accessNote: string
  capacity: string
  forRoles: StudioRole[]
}

export type DraftField = keyof EventDraft

export const DRAFT_LABELS: Record<DraftField, string> = {
  type: "Type of event",
  title: "Title",
  summary: "What it's about",
  chapterId: "Chapter calendar",
  date: "Date",
  start: "Starts",
  end: "Ends",
  format: "In person or online",
  area: "Area",
  stepFree: "Step-free access",
  stepFreeNote: "What isn't step-free",
  captions: "Captions or interpretation",
  languages: "Languages",
  childcare: "Childcare",
  accessNote: "Anything else about access",
  capacity: "How many people",
  forRoles: "Who it's for",
}

// A number followed by a street word: "1234 W 18th St", "12 High Street". Areas only, never addresses.
const STREET = /\b\d{1,6}[a-z]?\s+(?:[nsew]\.?\s+)?(?:[\w'.-]+\s+){0,3}(?:street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr|way|court|ct|place|pl|terrace|highway|hwy)\b\.?/i

export function looksLikeAddress(text: string) {
  return STREET.test(text)
}

const PERSONAL = "Take out email addresses and phone numbers. People who RSVP don't need them."
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/
const DATE = /^\d{4}-\d{2}-\d{2}$/

export function parseLanguages(text: string) {
  return [...new Set(text.split(/[,;\n]/).map((l) => l.trim()).filter(Boolean))]
}

/** Checks the host form. Keys are draft fields, in the order they appear on the form. Empty means it's ready. */
export function validateDraft(d: EventDraft, today: string): Partial<Record<DraftField, string>> {
  const errors: Partial<Record<DraftField, string>> = {}
  if (!d.type || !(EVENT_TYPES as readonly string[]).includes(d.type)) errors.type = "Choose the type of event."
  if (!d.title.trim()) errors.title = "Give the event a title."
  else if (d.title.trim().length > 120) errors.title = "Keep the title under 120 characters."
  if (!d.summary.trim()) errors.summary = "Say in a sentence or two what the event is about."
  if (!getChapter(d.chapterId)) errors.chapterId = "Choose which chapter's calendar it goes on."
  if (!DATE.test(d.date)) errors.date = "Choose a date."
  else if (d.date < today) errors.date = "Choose today or a later date."
  if (!TIME.test(d.start)) errors.start = "Choose a start time."
  if (!TIME.test(d.end)) errors.end = "Choose an end time."
  else if (TIME.test(d.start) && durationMinutes(d.start, d.end) <= 0) errors.end = "Choose an end time after the start time, on the same day."
  if (!d.format) errors.format = "Choose in person or online."
  if (d.format === "in-person") {
    if (!d.area.trim()) errors.area = "Say which area or neighborhood, so people know if they can get there."
    else if (looksLikeAddress(d.area)) errors.area = "Give the area or neighborhood only, not a street address. Share the exact place with people who RSVP."
  }
  if (!d.stepFree) errors.stepFree = "Say whether the place is step-free. For online events, choose step-free."
  else if (d.stepFree !== "yes" && !d.stepFreeNote.trim()) errors.stepFreeNote = "Say what isn't step-free, so people can plan."
  if (!d.captions) errors.captions = "Say whether there are captions or interpretation."
  if (parseLanguages(d.languages).length === 0) errors.languages = "List at least one language the event runs in."
  if (!d.childcare) errors.childcare = "Say whether there's childcare."
  const capacity = Number(d.capacity)
  if (!Number.isInteger(capacity) || capacity < 2 || capacity > 500) errors.capacity = "Enter a number from 2 to 500."
  if (d.forRoles.length === 0) errors.forRoles = "Choose at least one group the event is for."
  for (const field of ["title", "summary", "area", "stepFreeNote", "accessNote"] as const) {
    if (!errors[field] && findPersonalData(d[field]).length > 0) errors[field] = PERSONAL
  }
  return errors
}

/** Builds the event from a checked draft. The template supplies the agenda and library links. */
export function eventFromDraft(d: EventDraft, extra: { id: string; host: EventHost }): CommunityEvent {
  const type = d.type as EventType
  const chapter = getChapter(d.chapterId)!
  const { template } = EVENT_TYPE_INFO[type]
  return {
    id: extra.id,
    title: d.title.trim(),
    type,
    summary: d.summary.trim(),
    agenda: template.agenda,
    host: extra.host,
    chapterId: chapter.id,
    date: d.date,
    start: d.start,
    end: d.end,
    timeZone: chapter.timeZone,
    format: d.format as EventFormat,
    area: d.format === "in-person" ? d.area.trim() : undefined,
    access: {
      stepFree: d.stepFree as StepFree,
      stepFreeNote: d.stepFree !== "yes" ? d.stepFreeNote.trim() : undefined,
      captions: d.captions === "yes",
      languages: parseLanguages(d.languages),
      childcare: d.childcare === "yes",
      cost: "free",
      note: d.accessNote.trim() || undefined,
    },
    capacity: Number(d.capacity),
    forRoles: d.forRoles,
    links: template.links,
  }
}

// The calendar file ----------------------------------------------------------------------------------

const icsText = (text: string) => text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1")
const icsTime = (instant: number) => new Date(instant).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")

/** Lines longer than 75 characters continue on the next line after a space (RFC 5545, section 3.1). */
function fold(line: string) {
  const out: string[] = []
  for (let i = 0; i < line.length; i += i === 0 ? 75 : 74) out.push((i === 0 ? "" : " ") + line.slice(i, i === 0 ? 75 : i + 74))
  return out.join("\r\n")
}

/** An .ics file for one event, so people can add it to their own calendar. No sync, no reminders. */
export function toIcs(event: CommunityEvent, now: number) {
  const { start, end } = eventTimes(event, todayFrom(now))
  const description = [
    event.summary,
    `${typeLabel(event.type)} on the ${chapterName(event.chapterId)} calendar, hosted by ${event.host.name}.`,
    event.synthetic ? "Synthetic example from the BridgeGoodx prototype, not a real event." : "From the BridgeGoodx prototype (demo data).",
  ].join("\n\n")
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BridgeGoodx//Community events (prototype)//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@bridgegoodx.example.org`,
    `DTSTAMP:${icsTime(now)}`,
    `DTSTART:${icsTime(start)}`,
    `DTEND:${icsTime(end)}`,
    `SUMMARY:${icsText(event.title)}`,
    `DESCRIPTION:${icsText(description)}`,
    `LOCATION:${icsText(placeLabel(event))}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .map(fold)
    .join("\r\n")
    .concat("\r\n")
}
