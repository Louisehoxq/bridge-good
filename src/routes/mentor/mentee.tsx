import { Link } from "react-router"
import { PageHeader } from "@/components/app-shell"
import { MentorInbox } from "@/components/demo/conversation"
import { MentorOfficeHours } from "@/components/demo/office-hours"
import { useMatches } from "@/components/demo/journey-data"
import { PathStepper } from "@/components/path/path-stepper"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { MENTEE_PROFILE } from "@/content/journey"
import { PROBLEMS } from "@/content/problems"
import { DEMO_MENTOR } from "@/content/seed"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("My mentee")

export default function MyMentee() {
  const [matches] = useMatches()
  const team = matches.find((m) => m.mentorName === DEMO_MENTOR)
  const project = PROBLEMS.find((p) => p.id === team?.problemId)
  const first = MENTEE_PROFILE.name.split(" ")[0]

  return (
    <>
      <PageHeader eyebrow="My mentee" title={MENTEE_PROFILE.name}>
        Messages, office hours and where {first} is on their path, in one place. Ask how they&apos;re doing before you
        talk about the work.
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[2fr_3fr]">
        <section aria-labelledby="about-title" className="h-fit space-y-3 rounded-2xl bg-archetype-soft p-6">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="about-title" className="text-xl font-bold">
              In {first}&apos;s own words
            </h2>
            {MENTEE_PROFILE.synthetic && <SyntheticBadge />}
          </div>
          <p>
            <span className="block font-bold">What they hope to do</span>
            {MENTEE_PROFILE.hopes}
          </p>
          <p>
            <span className="block font-bold">What makes it hard</span>
            {MENTEE_PROFILE.barriers}
          </p>
          <p className="text-sm text-muted-foreground">{first} chose to share this. Keep it between you, unless they say otherwise.</p>
          {team && project ? (
            <p className="border-t pt-3">
              You&apos;re mentoring the team on <span className="font-bold">{project.title}</span> with {team.apprentices.join(", ")}.
            </p>
          ) : (
            <p className="border-t pt-3 text-sm">
              Not on a partner project yet. Their chapter lead forms teams on{" "}
              <span className="font-semibold">Matching &amp; milestones</span>.
            </p>
          )}
        </section>
        <PathStepper pathKey="student" variant="compact" title={`${first}'s path`} linkToPath={false} />
      </div>

      <section aria-labelledby="inbox-title" className="mt-12">
        <h2 id="inbox-title" className="mb-4 text-2xl font-bold">
          Messages
        </h2>
        <MentorInbox headingLevel={3} />
      </section>

      <section aria-labelledby="hours-title" className="mt-12">
        <h2 id="hours-title" className="mb-1 text-2xl font-bold">
          Office hours
        </h2>
        <p className="mb-4 text-muted-foreground">
          Offer slots for apprentices to book, and see what they&apos;d like to talk about. Times are in Pacific Time (PT).
        </p>
        <MentorOfficeHours headingLevel={3} />
      </section>

      <p className="mt-10 text-sm text-muted-foreground">
        Growth conversations on {first}&apos;s work are in{" "}
        <Link to="/mentor/submissions" className="underline underline-offset-4">
          Growth conversations
        </Link>
        .
      </p>
    </>
  )
}
