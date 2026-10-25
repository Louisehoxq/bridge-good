import { useRef, useState, type FormEvent } from "react"
import { Link } from "react-router"
import { PageHeader } from "@/components/app-shell"
import { useMatches, usePartnerFeedback } from "@/components/demo/journey-data"
import { MilestoneList } from "@/components/demo/milestones"
import { SubmittedBriefs } from "@/components/partner/submitted-briefs"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { PartnerRetrospective } from "@/components/feedback/partner-retrospective" // Milestone 3 hook
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PARTNER_PROBLEM_ID, SPRINT_MILESTONES } from "@/content/journey"
import { PROBLEMS } from "@/content/problems"
import { newId, nowLabel } from "@/lib/demo-store"
import { Icon } from "@/components/icon"
import { ErrorSummary, Notice } from "@/components/notice"
import { CHAPTER_LEAD, PARTNER_NAME, teamFor, TeamView } from "@/components/team/team-view"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("My project and team")

export default function PartnerProject() {
  const [matches] = useMatches()
  const project = PROBLEMS.find((p) => p.id === PARTNER_PROBLEM_ID)!
  const match = matches.find((m) => m.problemId === PARTNER_PROBLEM_ID)
  const reached = match?.milestone ?? -1
  const status = match ? `In the sprint: ${SPRINT_MILESTONES[reached].title} reached` : "Open for apprentices: a team is being formed"

  return (
    <>
      <PageHeader title={project.title}>
        Where your project is, who&apos;s working on it, and how to tell us what&apos;s changing for the people you serve.
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[2fr_3fr]">
        <section aria-labelledby="status-title" className="min-w-0 space-y-3 rounded-2xl border bg-card p-6">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="status-title" className="type-title-3">
              Status
            </h2>
            {project.synthetic && <SyntheticBadge />}
          </div>
          <p className="flex gap-2 rounded-lg bg-archetype-soft p-3 font-bold">
            <Icon name={match ? "pencil-ruler" : "clipboard-list"} className="mt-0.5" />
            {status}
          </p>
          <p>{project.summary}</p>
          <dl className="grid gap-2 sm:grid-cols-2">
            <div>
              <dt className="font-bold">Who it&apos;s for</dt>
              <dd>{project.community}</dd>
            </div>
            {project.accessibilityFocus && (
              <div>
                <dt className="font-bold">Accessibility focus</dt>
                <dd>{project.accessibilityFocus}</dd>
              </div>
            )}
          </dl>
        </section>

        <section id="team" aria-labelledby="team-title" className="min-w-0 scroll-mt-24 rounded-2xl border bg-card p-6">
          <h2 id="team-title" className="type-title-3">
            Your team
          </h2>
          {match ? (
            <>
              <p className="mb-6 text-muted-foreground">The people working on your project with you.</p>
              <TeamView label="Your project team" members={teamFor(match, PARTNER_NAME)} />
            </>
          ) : (
            <>
              <p className="mt-2 mb-6">
                Your chapter lead, {CHAPTER_LEAD}, is talking with apprentices who are interested in your brief. You&apos;ll
                meet the team at kickoff.
              </p>
              <TeamView
                label="Your project so far"
                members={[
                  { name: PARTNER_NAME, role: "community-partner", you: true },
                  { name: CHAPTER_LEAD, role: "chapter-lead" },
                ]}
              />
            </>
          )}
        </section>
      </div>

      <section id="timeline" aria-labelledby="timeline-title" className="mt-12 scroll-mt-24">
        <h2 id="timeline-title" className="type-title-2">
          Four-week sprint
        </h2>
        <p className="text-muted-foreground">
          About 1 to 2 hours a week from you: a kickoff, weekly check-ins, and help setting up conversations with your
          community.
        </p>
        <MilestoneList reached={reached} />
      </section>

      <div className="mt-12">
        <SubmittedBriefs />
        <p className="mt-3">
          Have another problem?{" "}
          <Link to="/partner/submit" className="font-semibold underline underline-offset-4">
            Submit a problem
          </Link>
        </p>
      </div>

      <FeedbackForm />
      {/* Milestone 3 hook: the end-of-project retrospective goes to the BRIDGEGOOD steward. */}
      <PartnerRetrospective projectId={PARTNER_PROBLEM_ID} projectTitle={project.title} />
    </>
  )
}

function FeedbackForm() {
  const [feedback, setFeedback] = usePartnerFeedback()
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)
  const errorRef = useRef<HTMLDivElement>(null)
  const mine = feedback.filter((f) => f.problemId === PARTNER_PROBLEM_ID).toReversed()

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const get = (k: string) => String(data.get(k) ?? "").trim()
    if (!get("changed") && !get("heard") && !get("notWorking")) {
      setError("Write something in at least one box.")
      setSent(false)
      requestAnimationFrame(() => errorRef.current?.focus())
      return
    }
    setError("")
    setFeedback((prev) => [
      ...prev,
      { id: newId(), problemId: PARTNER_PROBLEM_ID, whatChanged: get("changed"), communityHeard: get("heard"), notWorking: get("notWorking"), at: nowLabel() },
    ])
    form.reset()
    setSent(true)
  }

  return (
    <section id="feedback" aria-labelledby="feedback-title" className="mt-12 grid scroll-mt-24 gap-6 xl:grid-cols-[3fr_2fr]">
      <form onSubmit={submit} noValidate className="space-y-4 rounded-2xl border bg-card p-6">
        <div>
          <h2 id="feedback-title" className="type-title-2">
            Tell us how it&apos;s going
          </h2>
          <p className="mt-1 text-muted-foreground">
            Any time, not only at the end. It goes to your chapter lead and to BRIDGEGOOD. BRIDGEGOOD reads every note and
            decides what changes in the philosophy, and credits where each change came from.
          </p>
        </div>
        <ErrorSummary errors={error ? [{ field: "fb-changed", message: error }] : []} summaryRef={errorRef} title="Before sending:" />
        <div role="status">
          {sent && (
            <Notice tone="success">
              <p>Thank you. Saved in this browser.</p>
            </Notice>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="fb-changed">
            What has changed for the people you serve?
          </Label>
          <Textarea id="fb-changed" name="changed" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="fb-heard">
            What have community members told you about the work?
          </Label>
          <p id="fb-heard-hint" className="text-muted-foreground">
            Describe what people said as a group. No names or personal details, and only what they agreed to share.
          </p>
          <Textarea id="fb-heard" name="heard" aria-describedby="fb-heard-hint" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="fb-not">
            What isn&apos;t working, or what should change?
          </Label>
          <Textarea id="fb-not" name="notWorking" />
        </div>
        <Button type="submit" className="bg-archetype text-on-archetype hover:bg-archetype/90">
          Send feedback
        </Button>
      </form>
      <div>
        <h3 className="mb-3 type-title-3">What you&apos;ve sent</h3>
        {mine.length === 0 ? (
          <p className="text-muted-foreground">Nothing yet.</p>
        ) : (
          <ul className="space-y-3">
            {mine.map((f) => (
              <li key={f.id} className="rounded-xl border bg-card p-4 [overflow-wrap:anywhere]">
                <p className="type-small text-muted-foreground">{f.at}</p>
                {f.whatChanged && <p className="mt-1">{f.whatChanged}</p>}
                {f.communityHeard && <p className="mt-1">{f.communityHeard}</p>}
                {f.notWorking && <p className="mt-1">{f.notWorking}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
