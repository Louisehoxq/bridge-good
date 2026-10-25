import type { StudioRole } from "@/components/studio/role-badge"

/**
 * Community events: chapters own calendars, and each event is a simple page with an RSVP. Deliberately not a
 * ticketing platform: no payments, waitlists, reminders, calendar sync, recurring series or check-in.
 *
 * Every event in the app is synthetic. Places are an area only, never a street address, and people are the
 * synthetic demo accounts.
 */
export const EVENT_TYPES = ["critique-circle", "site-visit", "portfolio-review", "listening-session", "demo-day", "chapter-meetup"] as const
export type EventType = (typeof EVENT_TYPES)[number]

export const EVENT_FORMATS = ["in-person", "online"] as const
export type EventFormat = (typeof EVENT_FORMATS)[number]

/** Roles that can host an event: local chapter leads, community partners and company hosts. */
export const HOST_ROLES = ["chapter-lead", "company-host", "community-partner"] as const satisfies readonly StudioRole[]
export type HostRole = (typeof HOST_ROLES)[number]

/** Who an event is for. Students, alumni and mentors take part without a login. The steward attends too. */
export const AUDIENCE_ROLES = ["apprentice", "mentor", "chapter-lead", "company-host", "community-partner"] as const satisfies readonly StudioRole[]

/** "Partly" always comes with a note saying what isn't step-free. */
export type StepFree = "yes" | "partly" | "no"

/** Required for every event, so people can decide whether they can come before they RSVP. */
export type Accessibility = {
  stepFree: StepFree
  stepFreeNote?: string
  /** Live captions online, or captions and a hearing loop or interpreter in person. */
  captions: boolean
  /** Languages the event runs in, including sign languages. */
  languages: string[]
  childcare: boolean
  /** Always free. Kept as a field so the page can say so plainly. */
  cost: "free"
  /** Anything else: quiet room, breaks, food, transit. */
  note?: string
}

export type EventHost = { role: StudioRole; name: string }

export type CommunityEvent = {
  id: string
  title: string
  type: EventType
  summary: string
  /** The plan, step by step. Prefilled from the type's template. */
  agenda: { title: string; minutes: number; text?: string }[]
  host: EventHost
  chapterId: string
  /**
   * The day, as YYYY-MM-DD in the chapter's time zone. Seed events use `inDays` instead (days from today), so the
   * demo always has upcoming and past events.
   */
  date?: string
  inDays?: number
  /** Wall-clock times in `timeZone`, as HH:MM. */
  start: string
  end: string
  timeZone: string
  format: EventFormat
  /** In person: an area or neighborhood only, never a street address. */
  area?: string
  access: Accessibility
  capacity: number
  /** Who it's for. */
  forRoles: StudioRole[]
  /** What it connects to: Practice Library tools, and a Decision Lab scenario to warm up with. */
  links: { resources: string[]; scenario?: string }
  /** Synthetic RSVPs already counted, for seed events. */
  seedGoing?: number
  featured?: boolean
  /** Demo only: the host chose "pretend this event has happened" to try the reflection. */
  demoEnded?: boolean
  synthetic?: boolean
}

/** One RSVP. Holds the synthetic demo account's name and role, nothing else. */
export type Rsvp = { id: string; eventId: string; name: string; role: StudioRole; at: string }
