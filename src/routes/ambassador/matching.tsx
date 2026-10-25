import { useState, type FormEvent } from "react"
import { PageHeader } from "@/components/app-shell"
import { useInterests, useMatches } from "@/components/demo/journey-data"
import { MilestoneList } from "@/components/demo/milestones"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CHAPTER_MENTORS, SPRINT_MILESTONES, type ProjectInterest, type TeamMatch } from "@/content/journey"
import { PROBLEMS, type Problem } from "@/content/problems"
import { newId, nowLabel } from "@/lib/demo-store"
import { useSession } from "@/lib/session"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Matching & milestones")

export default function MatchingPage() {
  const [interests] = useInterests()
  const [matches, setMatches] = useMatches()
  const [status, setStatus] = useState("")
  // Chapter leads form teams and move milestones on. Company hosts see the same page, read-only.
  const canEdit = (useSession()?.ambassadorKind ?? "chapter-lead") === "chapter-lead"
  const open = PROBLEMS.filter((p) => p.status === "open-for-students")

  function advance(id: string) {
    setMatches((prev) => prev.map((m) => (m.id === id ? { ...m, milestone: Math.min(m.milestone + 1, SPRINT_MILESTONES.length - 1) } : m)))
    setStatus("Milestone updated. The partner and team see it on their pages.")
  }

  return (
    <>
      <PageHeader eyebrow="Matching & milestones" title="Form teams, then keep them on track">
        Read what apprentices wrote about each brief, then talk with them before you decide. Matching uses what people
        told you and your own judgment. This app never scores or ranks apprentices, and it doesn&apos;t ask about their
        identity.
      </PageHeader>
      <p role="status" className="sr-only">
        {status}
      </p>
      {!canEdit && (
        <p className="mb-8 rounded-xl bg-archetype-soft p-4">
          Chapter leads form the teams and update milestones. As a company host you can follow along here, and help at
          Demo Day.
        </p>
      )}

      <section id="matching" aria-labelledby="matching-title" className="scroll-mt-24">
        <h2 id="matching-title" className="mb-4 text-2xl font-bold">
          Matching
        </h2>
        <ul className="space-y-6">
          {open.map((p) => (
            <MatchCard
              key={p.id}
              problem={p}
              interests={interests.filter((i) => i.problemId === p.id)}
              match={matches.find((m) => m.problemId === p.id)}
              canEdit={canEdit}
              onMatch={(apprentices, mentorName) => {
                setMatches((prev) => [...prev, { id: newId(), problemId: p.id, apprentices, mentorName, milestone: 0, at: nowLabel() }])
                setStatus(`Team formed for ${p.title}.`)
              }}
            />
          ))}
        </ul>
      </section>

      <section id="milestones" aria-labelledby="milestones-title" className="mt-14 scroll-mt-24">
        <h2 id="milestones-title" className="mb-1 text-2xl font-bold">
          Milestones
        </h2>
        <p className="mb-4 text-muted-foreground">Every partner project is a four-week sprint that ends at Demo Day, then a retrospective.</p>
        {matches.length === 0 ? (
          <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">No teams yet.</p>
        ) : (
          <ul className="space-y-6">
            {matches.map((m) => (
              <Milestones key={m.id} match={m} onAdvance={canEdit ? () => advance(m.id) : undefined} />
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

function MatchCard({
  problem,
  interests,
  match,
  canEdit,
  onMatch,
}: {
  problem: Problem
  interests: ProjectInterest[]
  match?: TeamMatch
  canEdit: boolean
  onMatch: (apprentices: string[], mentorName: string) => void
}) {
  const [error, setError] = useState("")

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const apprentices = data.getAll("apprentice").map(String)
    if (apprentices.length === 0) {
      setError("Choose at least one apprentice for the team.")
      return
    }
    setError("")
    onMatch(apprentices, String(data.get("mentor")))
  }

  const errorId = `${problem.id}-match-error`
  return (
    <li className="rounded-2xl border bg-card p-6">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-xl font-bold">{problem.title}</h3>
        {problem.synthetic && <SyntheticBadge />}
      </div>
      <p className="text-sm text-muted-foreground">
        {problem.organisationType} · {problem.location}
      </p>

      <h4 className="mt-4 font-bold">What apprentices said</h4>
      {interests.length === 0 ? (
        <p className="text-muted-foreground">No one has said they&apos;re interested yet.</p>
      ) : (
        <ul className="mt-2 grid gap-3 lg:grid-cols-2">
          {interests.map((i) => (
            <li key={i.id} className="rounded-xl bg-muted p-4">
              <p className="flex flex-wrap items-center gap-2 font-bold">
                {i.apprenticeName}
                {i.synthetic && <SyntheticBadge />}
              </p>
              <p className="mt-1">
                <span className="font-semibold">Why: </span>
                {i.why}
              </p>
              {i.bring && (
                <p className="mt-1">
                  <span className="font-semibold">Brings: </span>
                  {i.bring}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">{i.at}</p>
            </li>
          ))}
        </ul>
      )}

      {match ? (
        <p className="mt-4 rounded-xl bg-archetype-soft p-4">
          <span className="font-bold">Team formed: </span>
          {match.apprentices.join(", ")}, with {match.mentorName} as mentor.
        </p>
      ) : (
        canEdit &&
        interests.length > 0 && (
          <form onSubmit={submit} noValidate className="mt-4 space-y-3 border-t pt-4">
            <fieldset aria-describedby={error ? errorId : undefined}>
              <legend className="font-bold">Who&apos;s on the team?</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {interests.map((i) => (
                  <label
                    key={i.id}
                    className="flex min-h-12 cursor-pointer items-center gap-2 rounded-lg border px-3 has-checked:border-archetype has-checked:bg-archetype-soft has-checked:font-bold"
                  >
                    <input type="checkbox" name="apprentice" value={i.apprenticeName} className="size-4 accent-[var(--archetype)]" />
                    {i.apprenticeName}
                  </label>
                ))}
              </div>
            </fieldset>
            {error && (
              <p id={errorId} role="alert" className="text-sm font-semibold text-destructive">
                {error}
              </p>
            )}
            <div className="max-w-md space-y-1">
              <Label htmlFor={`${problem.id}-mentor`} className="font-bold">
                Mentor
              </Label>
              <select id={`${problem.id}-mentor`} name="mentor" className="min-h-12 w-full rounded-xs border border-input bg-transparent px-4">
                {CHAPTER_MENTORS.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name}: {m.note}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" className="bg-archetype text-on-archetype hover:bg-archetype/90">
              Form this team
            </Button>
          </form>
        )
      )}
    </li>
  )
}

function Milestones({ match, onAdvance }: { match: TeamMatch; onAdvance?: () => void }) {
  const problem = PROBLEMS.find((p) => p.id === match.problemId)
  const next = SPRINT_MILESTONES[match.milestone + 1]
  return (
    <li className="rounded-2xl border bg-card p-6">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-xl font-bold">{problem?.title ?? match.problemId}</h3>
        {match.synthetic && <SyntheticBadge />}
      </div>
      <p className="text-sm text-muted-foreground">
        {match.apprentices.join(", ")} · mentor {match.mentorName}
      </p>
      <MilestoneList reached={match.milestone} />
      {next && onAdvance && (
        <Button variant="outline" className="mt-4" onClick={onAdvance}>
          Mark &ldquo;{next.title}&rdquo; as reached
        </Button>
      )}
    </li>
  )
}
