import { Link } from "react-router"
import { PageHeader } from "@/components/app-shell"
import { PathStepper } from "@/components/path/path-stepper"
import { DEMO_MENTOR } from "@/content/seed"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Your path")

export default function StudentPath() {
  return (
    <>
      <PageHeader eyebrow="Your path" title="From bootcamp to alumni">
        Five stages, in order. Each one links to where you do the work and to the library pages behind it. Your mentor
        and chapter lead help you move between stages. This page only shows where you are.
      </PageHeader>
      <div className="grid gap-8 xl:grid-cols-[3fr_1fr]">
        <PathStepper pathKey="student" />
        <aside className="h-fit space-y-4 rounded-2xl bg-archetype-soft p-5">
          <h2 className="text-lg font-bold">After the path</h2>
          <p>
            Alumni keep their portfolio pieces, and many come back as mentors or start a chapter. {DEMO_MENTOR}, your
            mentor, finished the apprenticeship and now mentors (synthetic example).
          </p>
          <Link to="/learn/tracks/mentors" className="inline-flex min-h-12 items-center font-semibold text-archetype underline underline-offset-4">
            What mentors do
          </Link>
        </aside>
      </div>
    </>
  )
}
