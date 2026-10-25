import { useId } from "react"
import { Link, useSearchParams } from "react-router"
import { AppShell } from "@/components/app-shell"
import { EventCard } from "@/components/events/event-parts"
import { Icon } from "@/components/icon"
import { buttonVariants } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import { CHAPTERS } from "@/content/chapters"
import { EVENT_TYPE_INFO } from "@/content/events"
import { canHost, FORMAT_INFO, past, upcoming } from "@/lib/events/logic"
import { useEvents, useRsvps, whoFor } from "@/lib/events/store"
import { EVENT_FORMATS, EVENT_TYPES, type CommunityEvent } from "@/lib/events/types"
import { pageMeta } from "@/lib/meta"
import { useServerNow, useSession } from "@/lib/session"

export const meta = () => pageMeta("Community events")

/** Filters live in the URL, so a chapter page can link straight to its own calendar. */
function matches(event: CommunityEvent, params: URLSearchParams) {
  const chapter = params.get("chapter")
  const type = params.get("type")
  const format = params.get("format")
  return (!chapter || event.chapterId === chapter) && (!type || event.type === type) && (!format || event.format === format)
}

/** Public: upcoming events on every chapter's calendar, filtered by chapter, type and format. */
export default function EventsPage() {
  const id = useId()
  const [params, setParams] = useSearchParams()
  const now = useServerNow()
  const session = useSession()
  const who = whoFor(session)
  const [events] = useEvents()
  const [rsvps] = useRsvps()
  const shown = upcoming(events, now).filter((e) => matches(e, params))
  const before = past(events, now).filter((e) => matches(e, params))
  const chapter = CHAPTERS.find((c) => c.id === params.get("chapter"))

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <h1 className="type-title-1">Community events</h1>
            <p className="type-body-lg text-muted-foreground">
              Each chapter keeps a calendar of small, free events where people practice BRIDGEGOOD&apos;s Design for Social Good
              approach together: critique circles, site visits, listening sessions and more. Every event says up front how
              accessible it is.
            </p>
          </div>
          {canHost(who?.role) && (
            <Link to="/events/host" className={buttonVariants({ size: "lg" })}>
              <Icon name="calendar-plus" />
              Host an event
            </Link>
          )}
        </div>

        <fieldset className="mb-6 grid gap-4 rounded-2xl border bg-card p-4 sm:grid-cols-3">
          <legend className="sr-only">Filter events</legend>
          <div className="space-y-1.5">
            <Label htmlFor={`${id}-chapter`}>Chapter</Label>
            <NativeSelect id={`${id}-chapter`} value={params.get("chapter") ?? ""} onChange={(e) => setFilter("chapter", e.target.value)}>
              <option value="">All chapters</option>
              {CHAPTERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.city}, {c.country}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${id}-type`}>Type</Label>
            <NativeSelect id={`${id}-type`} value={params.get("type") ?? ""} onChange={(e) => setFilter("type", e.target.value)}>
              <option value="">All types</option>
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {EVENT_TYPE_INFO[t].plural}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${id}-format`}>Format</Label>
            <NativeSelect id={`${id}-format`} value={params.get("format") ?? ""} onChange={(e) => setFilter("format", e.target.value)}>
              <option value="">In person and online</option>
              {EVENT_FORMATS.map((f) => (
                <option key={f} value={f}>
                  {FORMAT_INFO[f].label}
                </option>
              ))}
            </NativeSelect>
          </div>
        </fieldset>

        <section aria-labelledby={`${id}-upcoming`}>
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 id={`${id}-upcoming`} className="type-title-2">
              {chapter ? `Upcoming on the ${chapter.city} calendar` : "Upcoming"}
            </h2>
            <p role="status" className="text-muted-foreground">
              {shown.length} {shown.length === 1 ? "event" : "events"}
            </p>
          </div>
          {shown.length === 0 ? (
            <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
              No upcoming events with these filters. Try another chapter or type.
            </p>
          ) : (
            <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {shown.map((e) => (
                <li key={e.id}>
                  <EventCard event={e} now={now} rsvps={rsvps} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {before.length > 0 && (
          <details className="mt-12 rounded-2xl border bg-card p-5">
            <summary className="flex min-h-12 cursor-pointer items-center type-title-3">Past events ({before.length})</summary>
            <p className="mt-2 max-w-3xl text-muted-foreground">
              After each event, the host tells BRIDGEGOOD what they learned. A BRIDGEGOOD steward reads it and replies with a reason.
            </p>
            <ul className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {before.map((e) => (
                <li key={e.id}>
                  <EventCard event={e} now={now} rsvps={rsvps} ended />
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </AppShell>
  )
}
