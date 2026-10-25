import { useId, useRef, useState } from "react"
import { Link } from "react-router"
import { WHAT_WE_LEARNED_HEADING } from "@/components/events/what-we-learned"
import { Icon } from "@/components/icon"
import { RoleBadge } from "@/components/studio/role-badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { newId, nowLabel } from "@/lib/demo-store"
import { goingCount, hasEnded, isHost, myRsvp, rsvpsFor, spotsLeft, toIcs } from "@/lib/events/logic"
import { useEvents, useRsvps, whoFor } from "@/lib/events/store"
import type { CommunityEvent } from "@/lib/events/types"
import { useSession } from "@/lib/session"

/** A made-up join link, shown only to people who RSVP'd and the host. It goes nowhere. */
const joinLink = (event: CommunityEvent) => `meet.example.org/bgx-${event.id}`

/**
 * RSVP for signed-in demo accounts. Logged-out visitors see how to join. No waitlist: a full event says so.
 * The host sees who's coming instead.
 */
export function RsvpPanel({ event, now }: { event: CommunityEvent; now: number }) {
  const id = useId()
  const session = useSession()
  const who = whoFor(session)
  const [rsvps, setRsvps] = useRsvps()
  const [status, setStatus] = useState("")
  const headingRef = useRef<HTMLHeadingElement>(null)
  const mine = myRsvp(event.id, rsvps, who)
  const left = spotsLeft(event, rsvps)
  const ended = hasEnded(event, now)
  const hosting = isHost(event, who)

  function rsvp() {
    if (!who) return
    setRsvps((prev) => [...prev, { id: newId(), eventId: event.id, name: who.name, role: who.role, at: nowLabel() }])
    setStatus("You're going. It's on your overview page too.")
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  function cancel() {
    if (!mine) return
    setRsvps((prev) => prev.filter((r) => r.id !== mine.id))
    setStatus("Your RSVP is cancelled. Your spot is free for someone else.")
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  return (
    <section aria-labelledby={`${id}-title`} className="space-y-4 rounded-2xl border-2 border-primary bg-card p-6">
      <h2 id={`${id}-title`} ref={headingRef} tabIndex={-1} className="type-title-2">
        {ended ? "This event has happened" : hosting ? "You're hosting" : mine ? "You're going" : "Are you coming?"}
      </h2>
      <p className="flex items-center gap-2">
        <Icon name="users" />
        {ended
          ? `${goingCount(event, rsvps)} people said they'd come.`
          : left === 0
            ? `Full: all ${event.capacity} spots are taken.`
            : `${goingCount(event, rsvps)} going, ${left} of ${event.capacity} spots left.`}
      </p>

      {!ended && !session && (
        <div className="space-y-3">
          <p>
            RSVPs are for people in a BRIDGEGOOD chapter: apprentices, alumni, mentors, ambassadors and community partners. In this
            prototype, log in with a demo account to try it. There&apos;s no password.
          </p>
          <Link to={`/login?next=${encodeURIComponent(`/events/${event.id}`)}`} className={buttonVariants({ size: "lg" })}>
            <Icon name="log-in" />
            Log in to RSVP
          </Link>
          <p className="type-small text-muted-foreground">
            Not in a chapter? Your group can run a critique circle on its own with the{" "}
            <Link to="/learn/carry-it-forward" className="underline underline-offset-4">
              carry-it-forward kit
            </Link>
            .
          </p>
        </div>
      )}

      {!ended && session && !hosting && (
        <div className="flex flex-wrap items-center gap-3">
          {mine ? (
            <Button type="button" variant="destructive" onClick={cancel}>
              <Icon name="x" />
              Cancel my RSVP
            </Button>
          ) : left > 0 ? (
            <Button type="button" size="lg" onClick={rsvp} className="max-w-full whitespace-normal">
              <Icon name="calendar-check" />
              RSVP as {who?.name}
            </Button>
          ) : (
            <p>There&apos;s no waitlist. Look for another event on the calendar, or ask your chapter lead to run this one again.</p>
          )}
        </div>
      )}

      {(mine || hosting) && event.format === "online" && !ended && (
        <p className="rounded-xl bg-muted p-3">
          <span className="font-semibold">Join link (synthetic):</span> <span className="[overflow-wrap:anywhere]">{joinLink(event)}</span>
        </p>
      )}
      {(mine || hosting) && event.format === "in-person" && !ended && (
        <p className="rounded-xl bg-muted p-3">The host shares the exact place with people who RSVP. This page only ever shows the area.</p>
      )}

      <p role="status" className="font-semibold">
        {status}
      </p>

      {!ended && <IcsLink event={event} now={now} />}
      {hosting && <WhoIsComing event={event} />}
    </section>
  )
}

/** Add to your own calendar: a plain .ics file. No sync and no reminders. */
function IcsLink({ event, now }: { event: CommunityEvent; now: number }) {
  const href = `data:text/calendar;charset=utf-8,${encodeURIComponent(toIcs(event, now))}`
  return (
    <a href={href} download={`${event.id}.ics`} className={buttonVariants({ variant: "outline", className: "max-w-full whitespace-normal" })}>
      <Icon name="download" />
      Add to my calendar (.ics)
    </a>
  )
}

/** For the host: the demo accounts who RSVP'd, plus the synthetic count. */
function WhoIsComing({ event }: { event: CommunityEvent }) {
  const id = useId()
  const [rsvps] = useRsvps()
  const list = rsvpsFor(event.id, rsvps)
  return (
    <div className="space-y-2 border-t pt-4">
      <h3 id={`${id}-who`} className="type-title-3">
        Who&apos;s coming
      </h3>
      {list.length > 0 ? (
        <ul aria-labelledby={`${id}-who`} className="flex flex-wrap gap-2">
          {list.map((r) => (
            <li key={r.id}>
              <RoleBadge role={r.role}>{r.name}</RoleBadge>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">No demo accounts yet.</p>
      )}
      {event.seedGoing ? <p className="type-small text-muted-foreground">Plus {event.seedGoing} synthetic RSVPs, counted but not named.</p> : null}
    </div>
  )
}

/** Demo only: lets the host try "what we learned" without waiting for the date. */
export function PretendEnded({ event }: { event: CommunityEvent }) {
  const [, setEvents] = useEvents()
  return (
    <div className="space-y-2 rounded-2xl border border-dashed p-5">
      <p>
        After the event, you&apos;ll tell BRIDGEGOOD what you learned here. In this prototype you can skip ahead to try it.
      </p>
      <Button
        type="button"
        variant="outline"
        className="max-w-full whitespace-normal"
        onClick={() => {
          setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, demoEnded: true } : e)))
          requestAnimationFrame(() => document.getElementById(WHAT_WE_LEARNED_HEADING)?.focus())
        }}
      >
        <Icon name="hourglass" />
        Demo only: pretend this event has happened
      </Button>
    </div>
  )
}
