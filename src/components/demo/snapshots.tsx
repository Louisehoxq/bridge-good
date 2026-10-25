"use client"

import Link from "next/link"
import { useCollection } from "@/lib/demo-store"
import {
  DEMO_MENTOR,
  DEMO_STUDENT,
  SEED_EVALUATIONS,
  SEED_MESSAGES,
  SEED_SLOTS,
  SEED_SUBMISSIONS,
  type Evaluation,
  type Message,
  type Slot,
  type Submission,
} from "@/content/seed"

function Stat({ label, value, href, cta }: { label: string; value: string | number; href: string; cta: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border bg-card p-5">
      <p className="text-sm font-bold text-muted-foreground">{label}</p>
      <p className="font-heading text-3xl font-bold">{value}</p>
      <Link href={href} className="mt-auto inline-flex min-h-11 items-center font-semibold text-archetype underline underline-offset-4">
        {cta}
      </Link>
    </div>
  )
}

export function StudentSnapshot() {
  const [subs] = useCollection<Submission>("submissions", SEED_SUBMISSIONS)
  const [evals] = useCollection<Evaluation>("evaluations", SEED_EVALUATIONS)
  const [slots] = useCollection<Slot>("slots", SEED_SLOTS)
  const [msgs] = useCollection<Message>("messages", SEED_MESSAGES)
  const mine = subs.filter((s) => s.studentName === DEMO_STUDENT)
  const withFeedback = mine.filter((s) => evals.some((e) => e.submissionId === s.id)).length
  const booking = slots.find((s) => s.bookedBy === DEMO_STUDENT)
  const lastFromMentor = msgs.filter((m) => m.thread === DEMO_STUDENT && m.from === "mentor").at(-1)

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Stat label="Submissions" value={mine.length} href="/student/submissions" cta="Submit or view work" />
      <Stat label="With mentor feedback" value={withFeedback} href="/student/submissions" cta="Read feedback" />
      <Stat label="Next office hour" value={booking ? booking.when.split(",")[0] : "None"} href="/student/office-hours" cta={booking ? "See booking" : "Book a slot"} />
      <Stat label={`Latest from ${DEMO_MENTOR.split(" ")[0]}`} value={lastFromMentor ? "1 new" : "—"} href="/student/messages" cta="Open messages" />
    </div>
  )
}

export function MentorSnapshot() {
  const [subs] = useCollection<Submission>("submissions", SEED_SUBMISSIONS)
  const [evals] = useCollection<Evaluation>("evaluations", SEED_EVALUATIONS)
  const [slots] = useCollection<Slot>("slots", SEED_SLOTS)
  const [msgs] = useCollection<Message>("messages", SEED_MESSAGES)
  const waiting = subs.filter((s) => !evals.some((e) => e.submissionId === s.id)).length
  const booked = slots.filter((s) => s.mentorName === DEMO_MENTOR && s.bookedBy).length
  const threads = new Set(msgs.map((m) => m.thread)).size

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Stat label="Awaiting your review" value={waiting} href="/mentor/submissions" cta="Review submissions" />
      <Stat label="Office hours booked" value={booked} href="/mentor/office-hours" cta="Manage slots" />
      <Stat label="Student conversations" value={threads} href="/mentor/messages" cta="Open messages" />
    </div>
  )
}
