import { useId } from "react"
import { Link } from "react-router"
import { EventCard, EventTypeTag } from "@/components/events/event-parts"
import { Icon } from "@/components/icon"
import { buttonVariants } from "@/components/ui/button"
import { canHost, formatDay, isHost, todayFrom, upcoming, yourUpcoming } from "@/lib/events/logic"
import { useEvents, useRsvps, whoFor } from "@/lib/events/store"
import { useServerNow, useSession } from "@/lib/session"

/** On a chapter's entry at /chapters: its next events, and a link to its calendar. */
export function ChapterEvents({ chapterId, city }: { chapterId: string; city: string }) {
  const id = useId()
  const now = useServerNow()
  const [events] = useEvents()
  const next = upcoming(
    events.filter((e) => e.chapterId === chapterId),
    now
  )
  const today = todayFrom(now)
  return (
    <div className="mt-3 border-t pt-3">
      <h4 id={`${id}-title`} className="font-semibold">
        Upcoming events
      </h4>
      {next.length === 0 ? (
        <p className="text-muted-foreground">Nothing on the calendar yet.</p>
      ) : (
        <ul aria-labelledby={`${id}-title`} className="mt-1 space-y-1">
          {next.slice(0, 2).map((e) => (
            <li key={e.id}>
              <Link to={`/events/${e.id}`} className="inline-flex min-h-12 items-center gap-2 text-primary underline underline-offset-4">
                <span className="font-semibold">{formatDay(e, today, true)}</span>
                <span>{e.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link to={`/events?chapter=${chapterId}`} className="inline-flex min-h-12 items-center gap-2 font-semibold text-primary underline underline-offset-4">
        <Icon name="calendar" className="text-base" />
        {city} calendar{next.length > 2 ? ` (${next.length} events)` : ""}
      </Link>
    </div>
  )
}

/** On role overviews: what you're hosting or going to, plus a way to find or host more. */
export function YourUpcomingEvents() {
  const id = useId()
  const now = useServerNow()
  const session = useSession()
  const who = whoFor(session)
  const [events] = useEvents()
  const [rsvps] = useRsvps()
  if (!who) return null
  const mine = yourUpcoming(events, rsvps, who, now)
  return (
    <section aria-labelledby={`${id}-title`} className="mt-12 space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 id={`${id}-title`} className="type-title-2">
            Your upcoming events
          </h2>
          <p className="text-muted-foreground">Events you&apos;re hosting or said you&apos;d come to, on your chapter calendars.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/events" className={buttonVariants({ variant: "outline" })}>
            <Icon name="calendar" />
            Find events
          </Link>
          {canHost(who.role) && (
            <Link to="/events/host" className={buttonVariants({ variant: "outline" })}>
              <Icon name="calendar-plus" />
              Host an event
            </Link>
          )}
        </div>
      </div>
      {mine.length === 0 ? (
        <p className="rounded-2xl border border-dashed p-6 text-center text-muted-foreground">Nothing yet. Find an event on your chapter&apos;s calendar.</p>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {mine.map((e) => (
            <li key={e.id} className="space-y-2">
              <p className="type-small font-semibold text-muted-foreground">{isHost(e, who) ? "You're hosting" : "You're going"}</p>
              <EventCard event={e} now={now} rsvps={rsvps} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/** In the steward area: featured events coming up, like Demo Day and listening sessions. */
export function FeaturedEvents() {
  const id = useId()
  const now = useServerNow()
  const [events] = useEvents()
  const today = todayFrom(now)
  const featured = upcoming(events, now).filter((e) => e.featured)
  return (
    <section aria-labelledby={`${id}-title`} className="space-y-3 rounded-2xl border bg-card p-5">
      <h2 id={`${id}-title`} className="type-title-3">
        Featured events
      </h2>
      <p className="text-muted-foreground">After each event, the host&apos;s &ldquo;what we learned&rdquo; arrives in this inbox.</p>
      {featured.length === 0 ? (
        <p className="text-muted-foreground">No featured events coming up.</p>
      ) : (
        <ul className="space-y-3">
          {featured.map((e) => (
            <li key={e.id} className="space-y-1">
              <EventTypeTag type={e.type} />
              <p>
                <Link to={`/events/${e.id}`} className="inline-flex min-h-12 items-center font-semibold text-primary underline underline-offset-4">
                  {e.title}
                </Link>
              </p>
              <p className="type-small text-muted-foreground">{formatDay(e, today)}</p>
            </li>
          ))}
        </ul>
      )}
      <Link to="/events" className="inline-flex min-h-12 items-center gap-2 font-semibold text-primary underline underline-offset-4">
        <Icon name="calendar" className="text-base" />
        Every chapter calendar
      </Link>
    </section>
  )
}
