import { useState, type FormEvent } from "react"
import { Link } from "react-router"
import { PageHeader } from "@/components/app-shell"
import { useInterests, useMatches } from "@/components/demo/journey-data"
import { Icon } from "@/components/icon"
import { FieldMessage } from "@/components/notice"
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

/** The form or button the person used goes away, so move focus to the brief's heading and announce the result. */
function focusHeading(id: string) {
  requestAnimationFrame(() => document.getElementById(id)?.focus())
}

export default function ChooseProject() {
  const [interests, setInterests] = useInterests()
  const [matches] = useMatches()
  const [status, setStatus] = useState("")
  const open = PROBLEMS.filter((p) => p.status === "open-for-students")
  const myMatch = matches.find((m) => m.apprentices.includes(DEMO_STUDENT))
  const matchedProblem = PROBLEMS.find((p) => p.id === myMatch?.problemId)

  return (
    <>
      <PageHeader title="Open briefs from community partners">
        Read each brief, then tell your chapter lead, {CHAPTER_LEAD}, which one you&apos;d like and why. They talk with
        everyone who&apos;s interested before forming teams. What you write here informs that conversation. It doesn&apos;t
        decide anything by itself.
      </PageHeader>
      <p role="status" className="sr-only">
        {status}
      </p>

      {myMatch && matchedProblem && (
        <div className="mb-8 rounded-2xl border-2 border-archetype bg-archetype-soft p-5">
          <p className="flex items-center gap-2 type-label">
            <Icon name="circle-check" />
            You&apos;re on the team for &ldquo;{matchedProblem.title}&rdquo;
          </p>
          <p className="mt-1">
            With {myMatch.apprentices.filter((a) => a !== DEMO_STUDENT).join(", ") || "your team"}, mentored by {myMatch.mentorName}. Your
            capstone is the next step on{" "}
            <Link to="/student" className="font-semibold underline underline-offset-4">
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
          const titleId = `${p.id}-title`
          return (
            <li key={p.id}>
              <article aria-labelledby={titleId} className="flex h-full flex-col gap-4 rounded-2xl border bg-card p-4 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 type-small font-semibold">
                    <Icon name="clipboard-list" className="text-base" />
                    Open for apprentices
                  </span>
                  {p.synthetic && <SyntheticBadge />}
                </div>
                <h2 id={titleId} tabIndex={-1} className="type-title-3">
                  {p.title}
                </h2>
                <p className="type-small text-muted-foreground">
                  {p.organizationType} · {p.location}
                </p>
                <p>{p.summary}</p>
                <dl className="grid gap-2 sm:grid-cols-2">
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
                <p className="text-muted-foreground">
                  {others === 0 ? "No one else has said they're interested yet." : `${others} other apprentice${others === 1 ? " has" : "s have"} said they're interested.`}
                </p>
                <div className="mt-auto border-t pt-4">
                  {mine ? (
                    <div className="space-y-2">
                      <p className="font-bold">You told {CHAPTER_LEAD} you&apos;re interested</p>
                      <p>
                        <span className="font-semibold">Why: </span>
                        {mine.why}
                      </p>
                      {mine.bring && (
                        <p>
                          <span className="font-semibold">What you bring: </span>
                          {mine.bring}
                        </p>
                      )}
                      {!myMatch && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setInterests((prev) => prev.filter((i) => i.id !== mine.id))
                            setStatus(`You took back your interest in ${p.title}.`)
                            focusHeading(titleId)
                          }}
                        >
                          Take back my interest
                        </Button>
                      )}
                    </div>
                  ) : myMatch ? null : (
                    <InterestForm
                      problemId={p.id}
                      onSubmit={(why, bring) => {
                        setInterests((prev) => [...prev, { id: newId(), problemId: p.id, apprenticeName: DEMO_STUDENT, why, bring, at: nowLabel() }])
                        setStatus(`Sent. ${CHAPTER_LEAD} can read why you'd like ${p.title}.`)
                        focusHeading(titleId)
                      }}
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
    const form = e.currentTarget
    const data = new FormData(form)
    const why = String(data.get("why") ?? "").trim()
    const bring = String(data.get("bring") ?? "").trim()
    if (!why) {
      setError("Say in a sentence why you'd like this project.")
      requestAnimationFrame(() => (form.elements.namedItem("why") as HTMLTextAreaElement | null)?.focus())
      return
    }
    setError("")
    onSubmit(why, bring)
  }

  const errorId = `${problemId}-why-error`
  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor={`${problemId}-why`}>Why this project?</Label>
        <Textarea id={`${problemId}-why`} name="why" rows={2} aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined} />
        {error && <FieldMessage id={errorId}>{error}</FieldMessage>}
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${problemId}-bring`}>
          What do you bring to it? <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <p id={`${problemId}-bring-hint`} className="text-muted-foreground">
          Skills, languages, or experiences that could help. Share only what you&apos;re comfortable sharing.
        </p>
        <Textarea id={`${problemId}-bring`} name="bring" rows={2} aria-describedby={`${problemId}-bring-hint`} />
      </div>
      <Button type="submit" className="bg-archetype text-on-archetype hover:bg-archetype/90">
        Tell my chapter lead
      </Button>
    </form>
  )
}
