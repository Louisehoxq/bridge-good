"use client"

import { useState, type FormEvent } from "react"
import { CalendarClockIcon } from "lucide-react"
import { newId, useCollection } from "@/lib/demo-store"
import { DEMO_MENTOR, DEMO_STUDENT, SEED_SLOTS, type Slot } from "@/content/seed"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function StudentOfficeHours() {
  const [slots, setSlots] = useCollection<Slot>("slots", SEED_SLOTS)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const mine = slots.filter((s) => s.bookedBy === DEMO_STUDENT)
  const open = slots.filter((s) => !s.bookedBy)

  const book = (id: string) =>
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, bookedBy: DEMO_STUDENT, bookingNote: notes[id] ?? "" } : s)))
  const cancel = (id: string) =>
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, bookedBy: undefined, bookingNote: undefined } : s)))

  return (
    <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
      <section aria-labelledby="open-slots">
        <h2 id="open-slots" className="mb-4 text-xl font-bold">
          Open slots
        </h2>
        {open.length === 0 && <p className="text-muted-foreground">No open slots right now. Check back soon.</p>}
        <ul className="grid gap-4 lg:grid-cols-2">
          {open.map((s) => (
            <li key={s.id} className="flex flex-col gap-3 rounded-xl border bg-card p-5">
              <p className="flex items-center gap-2 font-bold">
                <CalendarClockIcon className="size-5 text-archetype" aria-hidden="true" />
                {s.when}
              </p>
              <p>
                With {s.mentorName} · <span className="text-muted-foreground">{s.focus}</span>
              </p>
              <div className="space-y-1">
                <Label htmlFor={`note-${s.id}`}>What would you like to talk about? (optional)</Label>
                <Input id={`note-${s.id}`} value={notes[s.id] ?? ""} onChange={(e) => setNotes({ ...notes, [s.id]: e.target.value })} />
              </div>
              <Button onClick={() => book(s.id)} className="mt-auto bg-archetype text-white hover:bg-archetype/90">
                Book this slot
              </Button>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="my-bookings" className="rounded-2xl bg-archetype-soft p-5">
        <h2 id="my-bookings" className="mb-4 text-xl font-bold">
          Your bookings
        </h2>
        <ul className="space-y-3" aria-live="polite">
          {mine.length === 0 && <li className="text-muted-foreground">You haven&apos;t booked anything yet.</li>}
          {mine.map((s) => (
            <li key={s.id} className="rounded-xl border bg-card p-4">
              <p className="font-bold">{s.when}</p>
              <p className="text-sm">With {s.mentorName}</p>
              {s.bookingNote && <p className="mt-1 text-sm text-muted-foreground">Topic: {s.bookingNote}</p>}
              <Button variant="outline" size="sm" className="mt-2" onClick={() => cancel(s.id)}>
                Cancel booking
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export function MentorOfficeHours() {
  const [slots, setSlots] = useCollection<Slot>("slots", SEED_SLOTS)
  const [when, setWhen] = useState("")
  const [focus, setFocus] = useState("")
  const mine = slots.filter((s) => s.mentorName === DEMO_MENTOR)

  function add(e: FormEvent) {
    e.preventDefault()
    if (!when.trim()) return
    setSlots((prev) => [...prev, { id: newId(), mentorName: DEMO_MENTOR, when: when.trim(), focus: focus.trim() || "Open topics" }])
    setWhen("")
    setFocus("")
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
      <section aria-labelledby="your-slots">
        <h2 id="your-slots" className="mb-4 text-xl font-bold">
          Your slots
        </h2>
        <ul className="space-y-3" aria-live="polite">
          {mine.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4">
              <div className="flex-1">
                <p className="font-bold">{s.when}</p>
                <p className="text-sm text-muted-foreground">{s.focus}</p>
              </div>
              {s.bookedBy ? (
                <p className="rounded-lg bg-archetype-soft px-3 py-2 text-sm">
                  Booked by <span className="font-bold">{s.bookedBy}</span>
                  {s.bookingNote && <span className="block text-muted-foreground">Topic: {s.bookingNote}</span>}
                </p>
              ) : (
                <>
                  <span className="text-sm text-muted-foreground">Open</span>
                  <Button variant="outline" size="sm" onClick={() => setSlots((prev) => prev.filter((x) => x.id !== s.id))}>
                    Remove
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
      <form onSubmit={add} className="space-y-4 rounded-2xl border bg-card p-5" aria-labelledby="add-slot">
        <h2 id="add-slot" className="text-xl font-bold">
          Offer a slot
        </h2>
        <div className="space-y-1">
          <Label htmlFor="slot-when" className="font-bold">
            When
          </Label>
          <Input id="slot-when" value={when} onChange={(e) => setWhen(e.target.value)} placeholder="e.g. Mon 4 Nov, 5:00–5:30 pm PT" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="slot-focus" className="font-bold">
            Focus <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input id="slot-focus" value={focus} onChange={(e) => setFocus(e.target.value)} placeholder="e.g. Portfolio reviews" />
        </div>
        <Button type="submit" className="bg-archetype text-white hover:bg-archetype/90">
          Add slot
        </Button>
      </form>
    </div>
  )
}
