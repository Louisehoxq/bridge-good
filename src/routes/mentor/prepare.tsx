import { Link } from "react-router"
import { PageHeader } from "@/components/app-shell"
import { PathStepper } from "@/components/path/path-stepper"
import { PrinciplesInPractice } from "@/components/principles-in-practice"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Prepare")

const READING = [
  { href: "/learn/guides/mentor-commitment", title: "What mentoring asks of you", why: "The commitments, why each one matters, and what BRIDGEGOOD offers you." },
  { href: "/learn/tracks/mentors", title: "Mentor track", why: "Modules on care, growth conversations and difficult conversations. Use them in any order." },
  { href: "/learn/guides/mock-case", title: "How to run a mock case", why: "For your mentee's mini project." },
  { href: "/learn/guides/real-case", title: "How to support a real case", why: "Week by week through a four-week partner project." },
  { href: "/learn/pillars/design-for-good", title: "The five pillars", why: "What apprentices learn. Your feedback is organized by pillar." },
  { href: "/learn/guides/ai-and-social-good", title: "Teaching AI and social good", why: "Questions for a 30-minute conversation about AI with your mentee." },
]

export default function MentorPrepare() {
  return (
    <>
      <PageHeader title="Your mentor path">
        Start with the one-page explainer. Use the modules in any order, when you need them. Everything you read lives in
        the public library, so your mentee can read the same pages.
      </PageHeader>
      <div className="grid gap-8 xl:grid-cols-[3fr_2fr]">
        <PathStepper pathKey="mentor" />
        <aside aria-labelledby="reading-title" className="h-fit space-y-4">
          <h2 id="reading-title" className="type-title-3">
            Read before you start
          </h2>
          <ul className="space-y-3">
            {READING.map((r) => (
              <li key={r.href}>
                <Link to={r.href} className="block rounded-xl border bg-card p-4 hover:border-archetype hover:bg-archetype-soft">
                  <span className="block font-bold underline-offset-4">{r.title}</span>
                  <span className="text-muted-foreground">{r.why}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
      <section aria-labelledby="principles-title" className="mt-14">
        <h2 id="principles-title" className="mb-6 type-title-2">
          How BRIDGEGOOD works with mentors
        </h2>
        <PrinciplesInPractice role="mentor" />
      </section>
    </>
  )
}
