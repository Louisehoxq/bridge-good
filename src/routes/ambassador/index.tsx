import { Link } from "react-router"
import { PageHeader } from "@/components/app-shell"
import { YourUpcomingEvents } from "@/components/events/event-lists"
import { ImpactLoop } from "@/components/impact-loop"
import { useInterests, useMatches } from "@/components/demo/journey-data"
import { PathStepper } from "@/components/path/path-stepper"
import { ProblemBoard } from "@/components/problem-board"
import { PROBLEMS } from "@/content/problems"
import { accountFor } from "@/lib/roles"
import { useSession } from "@/lib/session"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Ambassador overview")

/** Chapter leads and company hosts share this area; each gets its own overview. */
export default function AmbassadorHome() {
  const session = useSession()
  const kind = session?.ambassadorKind ?? "chapter-lead"
  const account = accountFor({ role: "ambassador", ambassadorKind: kind })

  return (
    <>
      <PageHeader title={`Welcome back, ${account.name.split(" ")[0]}`}>
        {account.detail}.{" "}
        {kind === "chapter-lead"
          ? "Here's your partner pipeline, who wants to work on what, and where each project is."
          : "Here's where your company's time and money can help, without steering what the chapter works on."}
      </PageHeader>
      <div className="space-y-10">
        <PathStepper pathKey={kind} variant="compact" />
        {kind === "chapter-lead" ? <ChapterLeadOverview /> : <CompanyHostOverview />}
      </div>
      <YourUpcomingEvents />

      <section aria-labelledby="loop-title" className="mt-12">
        <h2 id="loop-title" className="mb-6 type-title-2">
          Where you fit
        </h2>
        <ImpactLoop current="ambassador" />
      </section>
    </>
  )
}

function ChapterLeadOverview() {
  const [interests] = useInterests()
  const [matches] = useMatches()
  const count = (s: string) => PROBLEMS.filter((p) => p.status === s).length
  const unmatched = interests.filter((i) => !matches.some((m) => m.problemId === i.problemId)).length
  const stats = [
    { label: "Need a sponsor", value: count("needs-sponsor"), href: "/ambassador/projects" },
    { label: "Open for apprentices", value: count("open-for-students"), href: "/ambassador/projects" },
    { label: "In progress", value: count("in-progress"), href: "/ambassador/matching#milestones" },
    { label: "Completed projects", value: count("completed"), href: "/ambassador/projects" },
  ]
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-archetype-soft p-5">
        <p className="type-body-lg">
          <span className="font-bold">{unmatched}</span> {unmatched === 1 ? "note" : "notes"} from apprentices about briefs they&apos;d like
          to work on.
        </p>
        <Link to="/ambassador/matching" className="inline-flex min-h-12 items-center font-semibold text-archetype underline underline-offset-4">
          Read them and form teams
        </Link>
      </div>
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label}>
            <Link to={s.href} className="flex flex-col gap-1 rounded-2xl border bg-card p-5 hover:border-archetype hover:bg-archetype-soft">
              <span className="type-small font-semibold text-muted-foreground">{s.label}</span>
              <span className="type-title-2">{s.value}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CompanyHostOverview() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-2">
        <section aria-labelledby="give-title" className="rounded-2xl border bg-card p-5">
          <h2 id="give-title" className="type-title-3">
            What your company gives
          </h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Mentors&apos; time, prepared with the mentor track</li>
            <li>Funding for seats, meals, software and transportation</li>
            <li>A room for Demo Day, and introductions to hiring managers</li>
          </ul>
        </section>
        <section aria-labelledby="line-title" className="rounded-2xl border-2 border-archetype p-5">
          <h2 id="line-title" className="type-title-3">
            Where the line is
          </h2>
          <p className="mt-2">
            Company hosts don&apos;t choose which problems the chapter takes on, and partner projects are never free work
            for your company. Say openly if your company could benefit.
          </p>
          <Link to="/learn/guides/ambassador-vetting" className="mt-2 inline-flex min-h-12 items-center font-semibold text-archetype underline underline-offset-4">
            What BRIDGEGOOD looks for
          </Link>
        </section>
      </div>
      <section aria-labelledby="sponsor-title">
        <h2 id="sponsor-title" className="mb-1 type-title-2">
          Projects that need a sponsor
        </h2>
        <p className="mb-4 text-muted-foreground">Chapters have already taken these on. Sponsoring one covers costs; it doesn&apos;t change the brief.</p>
        <ProblemBoard status={["needs-sponsor"]} />
      </section>
    </div>
  )
}
