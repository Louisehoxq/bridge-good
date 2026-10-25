import { Link } from "react-router"
import { PageHeader } from "@/components/app-shell"
import { ImpactLoop } from "@/components/impact-loop"
import { StudentSnapshot } from "@/components/demo/snapshots"
import { useMatches } from "@/components/demo/journey-data"
import { PathStepper } from "@/components/path/path-stepper"
import { mentoringPair, teamFor, TeamView } from "@/components/team/team-view"
import { PROBLEMS } from "@/content/problems"
import { DEMO_MENTOR, DEMO_STUDENT } from "@/content/seed"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Your path")

/** The apprentice home is their path: where they are, who they're working with, and what comes next. */
export default function StudentHome() {
  const [matches] = useMatches()
  const team = matches.find((m) => m.apprentices.includes(DEMO_STUDENT))
  const project = PROBLEMS.find((p) => p.id === team?.problemId)

  return (
    <>
      <PageHeader title={`Welcome back, ${DEMO_STUDENT.split(" ")[0]}`}>
        Your background is a strength. Your path has five stages, in order. Each one links to where you do the work and
        to the library pages behind it. Your mentor and chapter lead help you move between stages.
      </PageHeader>

      <section aria-labelledby="people-title" className="mb-10 rounded-2xl border bg-card p-6">
        <h2 id="people-title" className="type-title-3">
          {team && project ? `Your team on ${project.title}` : "Your people"}
        </h2>
        <p className="mb-6 text-muted-foreground">
          {team
            ? "The people you design with, from the partner who brought the problem to your chapter lead. Everyone shown is a synthetic example."
            : "You and the people who help you along the way. Everyone shown is a synthetic example."}
        </p>
        <TeamView
          label={team ? "Your project team" : "You, your mentor and your chapter lead"}
          members={team ? teamFor(team, DEMO_STUDENT) : mentoringPair("apprentice")}
        />
      </section>

      <StudentSnapshot />

      <section aria-labelledby="path-title" className="mt-12">
        <h2 id="path-title" className="mb-4 type-title-2">
          Your path, from bootcamp to alumni
        </h2>
        <div className="grid gap-8 xl:grid-cols-[3fr_1fr]">
          <PathStepper pathKey="student" headingLevel={3} />
          <aside aria-labelledby="after-title" className="h-fit space-y-4 rounded-2xl border bg-archetype-soft p-5">
            <h3 id="after-title" className="type-title-3">
              After the path
            </h3>
            <p>
              Alumni keep their portfolio pieces, and many come back as mentors or start a chapter. {DEMO_MENTOR}, your
              mentor, finished the apprenticeship and now mentors (synthetic example).
            </p>
            <Link to="/learn/tracks/mentors" className="inline-flex min-h-12 items-center font-semibold text-archetype underline underline-offset-4">
              What mentors do
            </Link>
          </aside>
        </div>
      </section>

      <section aria-labelledby="loop-title" className="mt-12">
        <h2 id="loop-title" className="mb-6 type-title-2">
          Where you fit
        </h2>
        <ImpactLoop current="student" />
      </section>
    </>
  )
}
