import { Link } from "react-router"
import { PageHeader } from "@/components/app-shell"
import { MentorInbox } from "@/components/demo/conversation"
import { MentorOfficeHours } from "@/components/demo/office-hours"
import { useMatches } from "@/components/demo/journey-data"
import { PathStepper } from "@/components/path/path-stepper"
import { PinnedNote } from "@/components/studio/pinned-note"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { mentoringPair, teamFor, TeamView } from "@/components/team/team-view"
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
      <PageHeader title={`Your mentee, ${MENTEE_PROFILE.name}`}>
        Messages, office hours and where {first} is on their path, in one place. Ask how they&apos;re doing before you
        talk about the work.
      </PageHeader>

      <section aria-labelledby="team-title" className="mb-8 rounded-2xl border bg-card p-6">
        <h2 id="team-title" className="type-title-3">
          {team && project ? `Your team on ${project.title}` : `You and ${first}`}
        </h2>
        <p className="mb-6 text-muted-foreground">
          {team && project
            ? "Everyone working on this partner project."
            : `Not on a partner project yet. Their chapter lead forms teams on Matching & milestones.`}
        </p>
        <TeamView label={team ? "Your project team" : "You, your mentee and their chapter lead"} members={team ? teamFor(team, DEMO_MENTOR) : mentoringPair("mentor")} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[2fr_3fr]">
        <PinnedNote
          icon="sprout"
          title={
            <span id="about-title" className="flex flex-wrap items-center gap-2">
              In {first}&apos;s own words
              {MENTEE_PROFILE.synthetic && <SyntheticBadge />}
            </span>
          }
          className="h-fit"
        >
          <p>
            <span className="block font-bold">What they hope to do</span>
            {MENTEE_PROFILE.hopes}
          </p>
          <p>
            <span className="block font-bold">What makes it hard</span>
            {MENTEE_PROFILE.barriers}
          </p>
          <p className="type-small">{first} chose to share this. Keep it between you, unless they say otherwise.</p>
        </PinnedNote>
        <PathStepper pathKey="student" variant="compact" title={`${first}'s path`} linkToPath={false} />
      </div>

      <section aria-labelledby="inbox-title" className="mt-12">
        <h2 id="inbox-title" className="mb-4 type-title-2">
          Messages
        </h2>
        <MentorInbox headingLevel={3} />
      </section>

      <section aria-labelledby="hours-title" className="mt-12">
        <h2 id="hours-title" className="mb-1 type-title-2">
          Office hours
        </h2>
        <p className="mb-4 text-muted-foreground">
          Offer slots for apprentices to book, and see what they&apos;d like to talk about. Times are in Pacific Time (PT).
        </p>
        <MentorOfficeHours headingLevel={3} />
      </section>

      <p className="mt-10 text-muted-foreground">
        Growth conversations on {first}&apos;s work are in{" "}
        <Link to="/mentor/conversations" className="underline underline-offset-4">
          Growth conversations
        </Link>
        .
      </p>
    </>
  )
}
