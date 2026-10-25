import { useRef, useState, type FormEvent, type RefObject } from "react"
import { Icon } from "@/components/icon"
import { newId, useCollection } from "@/lib/demo-store"
import { DEMO_MENTOR, DEMO_STUDENT, SEED_SLOTS, type Slot } from "@/content/seed"
import { FieldMessage } from "@/components/notice"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/** Move focus after React has re-rendered, so it isn't lost when the focused button disappears. */
function focusSoon(ref: RefObject<HTMLElement | null>) {
  requestAnimationFrame(() => ref.current?.focus())
}

export function StudentOfficeHours({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3"
  const [slots, setSlots] = useCollection<Slot>("slots", SEED_SLOTS)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const mine = slots.filter((s) => s.bookedBy === DEMO_STUDENT)
  const open = slots.filter((s) => !s.bookedBy)

  const [status, setStatus] = useState("")
  const openRef = useRef<HTMLHeadingElement>(null)
  const bookingsRef = useRef<HTMLHeadingElement>(null)

  function book(id: string) {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, bookedBy: DEMO_STUDENT, bookingNote: notes[id] ?? "" } : s)))
    setStatus("Booked. It's now in your bookings.")
    focusSoon(bookingsRef)
  }
  function cancel(id: string) {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, bookedBy: undefined, bookingNote: undefined } : s)))
    setStatus("Booking cancelled. The slot is open again.")
    focusSoon(openRef)
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
      <p role="status" className="sr-only">
        {status}
      </p>
      <section aria-labelledby="open-slots" className="min-w-0">
        <H id="open-slots" ref={openRef} tabIndex={-1} className="mb-4 type-title-3">
          Open slots
        </H>
        {open.length === 0 && <p className="text-muted-foreground">No open slots right now. Check back soon.</p>}
        <ul className="grid gap-4 lg:grid-cols-2">
          {open.map((s) => (
            <li key={s.id} className="flex flex-col gap-3 rounded-xl border bg-card p-5">
              <p className="flex items-center gap-2 font-bold">
                <Icon name="calendar_clock" className="text-archetype" />
                {s.when}
              </p>
              <p>
                With {s.mentorName} · <span className="text-muted-foreground">{s.focus}</span>
              </p>
              {s.synthetic && <SyntheticBadge />}
              <div className="space-y-1">
                <Label htmlFor={`note-${s.id}`}>
                  What would you like to talk about? <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input id={`note-${s.id}`} value={notes[s.id] ?? ""} onChange={(e) => setNotes({ ...notes, [s.id]: e.target.value })} />
              </div>
              <Button onClick={() => book(s.id)} className="mt-auto bg-archetype text-on-archetype hover:bg-archetype/90">
                Book this slot
                <span className="sr-only">: {s.when}</span>
              </Button>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="my-bookings" className="min-w-0 rounded-2xl border bg-archetype-soft p-5">
        <H id="my-bookings" ref={bookingsRef} tabIndex={-1} className="mb-4 type-title-3">
          Your bookings
        </H>
        <ul className="space-y-3">
          {mine.length === 0 && <li className="text-muted-foreground">You haven&apos;t booked anything yet.</li>}
          {mine.map((s) => (
            <li key={s.id} className="rounded-xl border bg-card p-4">
              <p className="font-bold">{s.when}</p>
              <p>With {s.mentorName}</p>
              {s.bookingNote && <p className="mt-1 text-muted-foreground">Topic: {s.bookingNote}</p>}
              <Button variant="outline" size="sm" className="mt-2" onClick={() => cancel(s.id)}>
                Cancel booking
                <span className="sr-only">: {s.when}</span>
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export function MentorOfficeHours({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3"
  const [slots, setSlots] = useCollection<Slot>("slots", SEED_SLOTS)
  const [when, setWhen] = useState("")
  const [focus, setFocus] = useState("")
  const [error, setError] = useState("")
  const [status, setStatus] = useState("")
  const slotsRef = useRef<HTMLHeadingElement>(null)
  const whenRef = useRef<HTMLInputElement>(null)
  const mine = slots.filter((s) => s.mentorName === DEMO_MENTOR)

  function remove(id: string) {
    setSlots((prev) => prev.filter((x) => x.id !== id))
    setStatus("Slot removed.")
    focusSoon(slotsRef)
  }

  function add(e: FormEvent) {
    e.preventDefault()
    if (!when.trim()) {
      setError("Say when the slot is, for example the day, date and time.")
      focusSoon(whenRef)
      return
    }
    setError("")
    setSlots((prev) => [...prev, { id: newId(), mentorName: DEMO_MENTOR, when: when.trim(), focus: focus.trim() || "Open topics" }])
    setWhen("")
    setFocus("")
    setStatus("Slot added. Apprentices can book it now.")
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
      <p role="status" className="sr-only">
        {status}
      </p>
      <section aria-labelledby="your-slots" className="min-w-0">
        <H id="your-slots" ref={slotsRef} tabIndex={-1} className="mb-4 type-title-3">
          Your slots
        </H>
        <ul className="space-y-3">
          {mine.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4">
              <div className="min-w-0 flex-1 basis-48">
                <p className="font-bold">{s.when}</p>
                <p className="text-muted-foreground">{s.focus}</p>
              </div>
              {s.bookedBy ? (
                <p className="flex gap-2 rounded-lg bg-archetype-soft px-3 py-2">
                  <Icon name="circle-check" className="mt-0.5 text-archetype" />
                  <span>
                    Booked by <span className="font-bold">{s.bookedBy}</span>
                    {s.bookingNote && <span className="block text-muted-foreground">Topic: {s.bookingNote}</span>}
                  </span>
                </p>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Icon name="calendar_today" />
                    Open
                  </span>
                  <Button variant="outline" size="sm" onClick={() => remove(s.id)}>
                    Remove
                    <span className="sr-only">: {s.when}</span>
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
      <form onSubmit={add} noValidate className="h-fit min-w-0 space-y-4 rounded-2xl border bg-card p-5" aria-labelledby="add-slot">
        <H id="add-slot" className="type-title-3">
          Offer a slot
        </H>
        <div className="space-y-1">
          <Label htmlFor="slot-when">When</Label>
          <Input
            ref={whenRef}
            id="slot-when"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            placeholder="e.g. Mon, Nov 4, 5:00–5:30 PM PT"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "slot-when-error" : undefined}
          />
          {error && <FieldMessage id="slot-when-error">{error}</FieldMessage>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="slot-focus">
            Focus <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input id="slot-focus" value={focus} onChange={(e) => setFocus(e.target.value)} placeholder="e.g. Portfolio reviews" />
        </div>
        <Button type="submit" className="bg-archetype text-on-archetype hover:bg-archetype/90">
          Add slot
        </Button>
      </form>
    </div>
  )
}
