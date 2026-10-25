import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { Icon } from "@/components/icon"
import { ReflectionHelper } from "@/components/lab/reflection-helper"
import { useLabReflections } from "@/components/lab/saved-reflections"
import { Notice } from "@/components/notice"
import { Button, buttonVariants } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { REFLECTION_PROMPTS, type ReflectionPromptId, type Scenario } from "@/content/lab"
import { resourceBySlug } from "@/content/practice-library"
import { newId, nowLabel } from "@/lib/demo-store"
import { cn } from "@/lib/utils"

const STEPS = ["Meet the situation", "Choose an approach", "Explore consequences", "Hear other perspectives", "Reflect", "Take it into practice"]
const OWN = "own"

/** The six-step Decision Lab flow. Nothing is graded: every approach shows its trade-offs. */
export function ScenarioFlow({ scenario }: { scenario: Scenario }) {
  const [step, setStep] = useState(0)
  const [choice, setChoice] = useState<string>("")
  const [own, setOwn] = useState("")
  const [reasoning, setReasoning] = useState("")
  const [ownHelped, setOwnHelped] = useState("")
  const [ownLeftOut, setOwnLeftOut] = useState("")
  const [interpretation, setInterpretation] = useState("")
  const [answers, setAnswers] = useState<Partial<Record<ReflectionPromptId, string>>>({})
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)
  const [, setReflections] = useLabReflections()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    headingRef.current?.focus()
  }, [step])

  const approach = scenario.approaches.find((a) => a.id === choice)
  const approachLabel = choice === OWN ? own.trim() : (approach?.label ?? "")

  function next() {
    if (step === 1) {
      if (!choice) return setError("Choose an approach, or propose your own.")
      if (choice === OWN && !own.trim()) return setError("Describe the approach you'd take.")
    }
    setError("")
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  function save() {
    setReflections((prev) => [...prev, { id: newId(), scenario: scenario.slug, approach: approachLabel, reasoning: reasoning.trim(), answers, at: nowLabel() }])
    setSaved(true)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
      <nav aria-label="Scenario steps">
        <ol className="space-y-1 lg:sticky lg:top-24">
          {STEPS.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                disabled={i > step}
                aria-current={i === step ? "step" : undefined}
                onClick={() => setStep(i)}
                className={cn(
                  "flex min-h-12 w-full items-center gap-3 rounded-md px-3 text-left disabled:cursor-not-allowed disabled:text-muted-foreground",
                  i === step ? "bg-surface-sunken font-bold" : "hover:bg-muted"
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full type-small font-bold",
                    i < step ? "bg-success text-white" : i === step ? "bg-action text-on-action" : "border border-input"
                  )}
                  aria-hidden="true"
                >
                  {i < step ? <Icon name="check" className="text-sm" /> : i + 1}
                </span>
                {s}
                {i < step && <span className="sr-only"> (done)</span>}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <section aria-labelledby="step-title" className="min-w-0 space-y-6 rounded-2xl border bg-card p-6 lg:p-8">
        <h2 id="step-title" ref={headingRef} tabIndex={-1} className="type-title-2 focus:outline-none">
          <span className="block type-small font-semibold text-muted-foreground">
            Step {step + 1} of {STEPS.length}
          </span>
          {STEPS[step]}
        </h2>

        {step === 0 && (
          <div className="space-y-4">
            <p className="type-body-lg">{scenario.situation}</p>
            <ul className="list-disc space-y-1 pl-5">
              {scenario.context.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="rounded-lg bg-note p-3 font-semibold">What would you do?</p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            {error && (
              <div role="alert">
                <Notice tone="error">{error}</Notice>
              </div>
            )}
            <fieldset className="space-y-2">
              <legend className="mb-2 font-semibold">Possible approaches</legend>
              {[...scenario.approaches.map((a) => ({ id: a.id, label: a.label })), { id: OWN, label: "Propose another approach and explain your reasoning." }].map((a) => (
                <label
                  key={a.id}
                  className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border p-3 has-checked:border-action has-checked:bg-surface-sunken"
                >
                  <input
                    type="radio"
                    name="approach"
                    value={a.id}
                    checked={choice === a.id}
                    onChange={() => setChoice(a.id)}
                    className="mt-1 size-5 shrink-0 accent-[var(--action)]"
                  />
                  <span>{a.label}</span>
                </label>
              ))}
            </fieldset>
            {choice === OWN && (
              <div className="space-y-1.5">
                <Label htmlFor="own">Your approach</Label>
                <Textarea id="own" value={own} onChange={(e) => setOwn(e.target.value)} />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="reasoning">
                Why this approach? <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Textarea id="reasoning" value={reasoning} onChange={(e) => setReasoning(e.target.value)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <p>
              <span className="font-semibold">You chose: </span>
              {approachLabel}
            </p>
            {approach ? (
              <Consequences approach={approach} />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="own-helped">Who might your approach help?</Label>
                  <Textarea id="own-helped" value={ownHelped} onChange={(e) => setOwnHelped(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="own-left">Who might it leave out, and what are the risks?</Label>
                  <Textarea id="own-left" value={ownLeftOut} onChange={(e) => setOwnLeftOut(e.target.value)} />
                </div>
              </div>
            )}
            <details className="rounded-lg border">
              <summary className="flex min-h-12 cursor-pointer items-center px-4 font-semibold">Compare with the other approaches</summary>
              <div className="space-y-6 border-t p-4">
                {scenario.approaches
                  .filter((a) => a.id !== choice)
                  .map((a) => (
                    <div key={a.id}>
                      <h3 className="mb-2 font-bold">{a.label}</h3>
                      <Consequences approach={a} compact />
                    </div>
                  ))}
              </div>
            </details>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p>How might different people interpret your choice?</p>
            <ul className="grid gap-3 md:grid-cols-2">
              {scenario.perspectives.map((p) => (
                <li key={p.who} className="rounded-lg bg-surface-sunken p-4">
                  <p className="type-small font-semibold text-muted-foreground">{p.who}</p>
                  <blockquote className="mt-1">&ldquo;{p.says}&rdquo;</blockquote>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground">These are fictional voices, written to show competing needs.</p>
            <div className="space-y-1.5">
              <Label htmlFor="interpretation">
                Whose reaction worries you most, and why? <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Textarea id="interpretation" value={interpretation} onChange={(e) => setInterpretation(e.target.value)} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            {REFLECTION_PROMPTS.map((p) => (
              <div key={p.id} className="space-y-1.5">
                <Label htmlFor={`r-${p.id}`}>{p.label}</Label>
                <Textarea id={`r-${p.id}`} value={answers[p.id] ?? ""} onChange={(e) => setAnswers({ ...answers, [p.id]: e.target.value })} />
              </div>
            ))}
            <ReflectionHelper scenario={scenario} approach={approachLabel} reasoning={[reasoning, interpretation].filter(Boolean).join("\n")} answers={answers} />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="flex flex-col gap-3 rounded-xl border p-5">
                <Icon name="sticky-note" className="text-2xl text-action" />
                <h3 className="type-title-3">Save your reflection</h3>
                <p className="text-muted-foreground">Kept in this browser only, so you can come back to it.</p>
                <div role="status">{saved && <Notice tone="success">Saved. Find it on the Decision Lab page.</Notice>}</div>
                {!saved && (
                  <Button onClick={save} className="mt-auto">
                    Save reflection
                  </Button>
                )}
              </div>
              <div className="flex flex-col gap-3 rounded-xl border p-5">
                <Icon name="pencil-ruler" className="text-2xl text-action" />
                <h3 className="type-title-3">Open a related tool</h3>
                <ul className="space-y-1">
                  {scenario.related.map((slug) => {
                    const r = resourceBySlug(slug)
                    return r ? (
                      <li key={slug}>
                        <Link to={`/library/${slug}`} className="inline-flex min-h-12 items-center underline underline-offset-4">
                          {r.title}
                        </Link>
                      </li>
                    ) : null
                  })}
                </ul>
              </div>
              <div className="flex flex-col gap-3 rounded-xl border p-5">
                <Icon name="users" className="text-2xl text-action" />
                <h3 className="type-title-3">Share a lesson</h3>
                <p className="text-muted-foreground">Learned something others could use? Contribute it to the Living Playbook.</p>
                <Link
                  to={`/playbook/contribute?kind=lesson&scenario=${scenario.slug}`}
                  className={buttonVariants({ variant: "outline", className: "mt-auto" })}
                >
                  Contribute a lesson
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-3 border-t pt-5">
          <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next}>
              Next: {STEPS[step + 1]}
              <Icon name="arrow-right" />
            </Button>
          ) : (
            <Link to="/lab" className={buttonVariants({ variant: "ghost" })}>
              All scenarios
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

function Consequences({ approach, compact = false }: { approach: Scenario["approaches"][number]; compact?: boolean }) {
  const groups = [
    { title: "Potential benefits", items: approach.benefits, icon: "circle-check" as const },
    { title: "Risks", items: approach.risks, icon: "triangle-alert" as const },
    { title: "Who might be helped", items: approach.helped, icon: "users" as const },
    { title: "Who might be left out", items: approach.leftOut, icon: "circle-alert" as const },
  ]
  return (
    <dl className={cn("grid gap-3", compact ? "md:grid-cols-2" : "md:grid-cols-2")}>
      {groups.map((g) => (
        <div key={g.title} className="rounded-lg bg-surface-sunken p-4">
          <dt className="flex items-center gap-2 font-bold">
            <Icon name={g.icon} />
            {g.title}
          </dt>
          {g.items.map((i) => (
            <dd key={i} className="mt-1">
              {i}
            </dd>
          ))}
        </div>
      ))}
    </dl>
  )
}
