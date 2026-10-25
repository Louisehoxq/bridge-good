import { useState, type FormEvent } from "react"
import { Link } from "react-router"
import { PageHeader } from "@/components/app-shell"
import { useInterests, useMatches } from "@/components/demo/journey-data"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PROBLEMS } from "@/content/problems"
import { DEMO_STUDENT } from "@/content/seed"
import { ROLE_INFO } from "@/lib/roles"
import { newId, nowLabel } from "@/lib/demo-store"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Choose a project")

const CHAPTER_LEAD = ROLE_INFO.ambassador.demoAccount.name

export default function ChooseProject() {
  const [interests, setInterests] = useInterests()
  const [matches] = useMatches()
  const open = PROBLEMS.filter((p) => p.status === "open-for-students")
  const myMatch = matches.find((m) => m.apprentices.includes(DEMO_STUDENT))
  const matchedProblem = PROBLEMS.find((p) => p.id === myMatch?.problemId)

  return (
    <>
      <PageHeader eyebrow="Choose a project" title="Open briefs from community partners">
        Read each brief, then tell your chapter lead, {CHAPTER_LEAD}, which one you&apos;d like and why. They talk with
        everyone who&apos;s interested before forming teams. What you write here informs that conversation. It doesn&apos;t
        decide anything by itself.
      </PageHeader>

      {myMatch && matchedProblem && (
        <div role="status" className="mb-8 rounded-2xl border-2 border-archetype bg-archetype-soft p-5">
          <p className="text-lg font-bold">You&apos;re on the team for &ldquo;{matchedProblem.title}&rdquo;</p>
          <p className="mt-1">
            With {myMatch.apprentices.filter((a) => a !== DEMO_STUDENT).join(", ") || "your team"}, mentored by {myMatch.mentorName}. Your
            capstone is the next step on{" "}
            <Link to="/student/path" className="font-semibold underline underline-offset-4">
              your path
            </Link>
            .
          </p>
        </div>
      )}

      <ul className="grid gap-6 xl:grid-cols-2">
        {open.map((p) => {
          const mine = interests.find((i) => i.problemId === p.id && i.apprenticeName === DEMO_STUDENT)
          const others = interests.filter((i) => i.problemId === p.id && i.apprenticeName !== DEMO_STUDENT).length
          return (
            <li key={p.id}>
              <article aria-labelledby={`${p.id}-title`} className="flex h-full flex-col gap-4 rounded-2xl border bg-card p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-archetype-soft px-2.5 py-0.5 text-xs font-bold text-archetype">Open for apprentices</span>
                  {p.synthetic && <SyntheticBadge />}
                </div>
                <h2 id={`${p.id}-title`} className="text-xl font-bold">
                  {p.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {p.organisationType} · {p.location}
                </p>
                <p>{p.summary}</p>
                <dl className="grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-bold">Who it&apos;s for</dt>
                    <dd>{p.community}</dd>
                  </div>
                  {p.accessibilityFocus && (
                    <div>
                      <dt className="font-bold">Accessibility focus</dt>
                      <dd>{p.accessibilityFocus}</dd>
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <dt className="font-bold">Skills involved</dt>
                    <dd>{p.skills.join(", ")}</dd>
                  </div>
                </dl>
                <p className="text-sm text-muted-foreground">
                  {others === 0 ? "No one else has said they're interested yet." : `${others} other apprentice${others === 1 ? " has" : "s have"} said they're interested.`}
                </p>
                <div className="mt-auto border-t pt-4">
                  {mine ? (
                    <div className="space-y-2">
                      <p className="font-bold">You told {CHAPTER_LEAD} you&apos;re interested</p>
                      <p className="text-sm">
                        <span className="font-semibold">Why: </span>
                        {mine.why}
                      </p>
                      {mine.bring && (
                        <p className="text-sm">
                          <span className="font-semibold">What you bring: </span>
                          {mine.bring}
                        </p>
                      )}
                      {!myMatch && (
                        <Button variant="outline" size="sm" onClick={() => setInterests((prev) => prev.filter((i) => i.id !== mine.id))}>
                          Take back my interest
                        </Button>
                      )}
                    </div>
                  ) : myMatch ? null : (
                    <InterestForm
                      problemId={p.id}
                      onSubmit={(why, bring) =>
                        setInterests((prev) => [...prev, { id: newId(), problemId: p.id, apprenticeName: DEMO_STUDENT, why, bring, at: nowLabel() }])
                      }
                    />
                  )}
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </>
  )
}

function InterestForm({ problemId, onSubmit }: { problemId: string; onSubmit: (why: string, bring: string) => void }) {
  const [error, setError] = useState("")

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const why = String(data.get("why") ?? "").trim()
    const bring = String(data.get("bring") ?? "").trim()
    if (!why) {
      setError("Say in a sentence why you'd like this project.")
      return
    }
    setError("")
    onSubmit(why, bring)
  }

  const errorId = `${problemId}-why-error`
  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor={`${problemId}-why`} className="font-bold">
          Why this project?
        </Label>
        <Textarea id={`${problemId}-why`} name="why" rows={2} aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined} />
        {error && (
          <p id={errorId} role="alert" className="text-sm font-semibold text-destructive">
            {error}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${problemId}-bring`} className="font-bold">
          What do you bring to it? <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea id={`${problemId}-bring`} name="bring" rows={2} aria-describedby={`${problemId}-bring-hint`} />
        <p id={`${problemId}-bring-hint`} className="text-xs text-muted-foreground">
          Skills, languages, or experiences that could help. Share only what you&apos;re comfortable sharing.
        </p>
      </div>
      <Button type="submit" className="bg-archetype text-on-archetype hover:bg-archetype/90">
        Tell my chapter lead
      </Button>
    </form>
  )
}
