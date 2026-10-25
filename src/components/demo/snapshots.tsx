import { Link } from "react-router"
import { useCollection } from "@/lib/demo-store"
import { DEMO_MENTOR, DEMO_STUDENT, SEED_MESSAGES, SEED_SLOTS, type Message, type Slot } from "@/content/seed"
import { useGrowthFeedback, useSubmissions } from "@/components/demo/journey-data"

function Stat({ label, value, href, cta }: { label: string; value: string | number; href: string; cta: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border bg-card p-5">
      <p className="text-sm font-bold text-muted-foreground">{label}</p>
      <p className="font-heading text-3xl font-bold">{value}</p>
      <Link to={href} className="mt-auto inline-flex min-h-12 items-center font-semibold text-archetype underline underline-offset-4">
        {cta}
      </Link>
    </div>
  )
}

export function StudentSnapshot() {
  const [subs] = useSubmissions()
  const [evals] = useGrowthFeedback()
  const [slots] = useCollection<Slot>("slots", SEED_SLOTS)
  const [msgs] = useCollection<Message>("messages", SEED_MESSAGES)
  const mine = subs.filter((s) => s.studentName === DEMO_STUDENT)
  const withFeedback = mine.filter((s) => evals.some((e) => e.submissionId === s.id)).length
  const booking = slots.find((s) => s.bookedBy === DEMO_STUDENT)
  const lastFromMentor = msgs.filter((m) => m.thread === DEMO_STUDENT && m.from === "mentor").at(-1)

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Stat label="Submissions" value={mine.length} href="/student/submissions" cta="Submit or view work" />
      <Stat label="Mentor replies" value={withFeedback} href="/student/submissions" cta="Read your mentor's words" />
      <Stat label="Next office hour" value={booking ? booking.when.split(",")[0] : "None"} href="/student/mentor" cta={booking ? "See booking" : "Book a slot"} />
      <Stat label={`Latest from ${DEMO_MENTOR.split(" ")[0]}`} value={lastFromMentor ? "1 new" : "None"} href="/student/mentor" cta="Open messages" />
    </div>
  )
}

export function MentorSnapshot() {
  const [subs] = useSubmissions()
  const [evals] = useGrowthFeedback()
  const [slots] = useCollection<Slot>("slots", SEED_SLOTS)
  const [msgs] = useCollection<Message>("messages", SEED_MESSAGES)
  const waiting = subs.filter((s) => !evals.some((e) => e.submissionId === s.id)).length
  const booked = slots.filter((s) => s.mentorName === DEMO_MENTOR && s.bookedBy).length
  const threads = new Set(msgs.map((m) => m.thread)).size

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Stat label="Waiting for your reply" value={waiting} href="/mentor/submissions" cta="Open growth conversations" />
      <Stat label="Office hours booked" value={booked} href="/mentor/mentee" cta="Manage slots" />
      <Stat label="Apprentice conversations" value={threads} href="/mentor/mentee" cta="Open messages" />
    </div>
  )
}
