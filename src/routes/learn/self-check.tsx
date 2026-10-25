import { useState } from "react"
import { Icon } from "@/components/icon"
import { LibraryPage } from "@/components/library/library-page"
import { Button, buttonVariants } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SELF_CHECK } from "@/content/eligibility"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Is this a good fit for you right now?")

/**
 * Self-check with no form and no storage: answers live in this component's state only, and vanish
 * when the page closes. Nothing is sent anywhere, and the answers decide nothing.
 */
export default function SelfCheckPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [status, setStatus] = useState("")
  const set = (id: string, value: string) => setAnswers((prev) => ({ ...prev, [id]: value }))

  return (
    <div data-archetype="student">
      <LibraryPage href="/learn/self-check" intro={<p>{SELF_CHECK.intro}</p>}>
        <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
          <div className="min-w-0 space-y-6">
            <p className="rounded-xl border bg-archetype-soft p-4 font-semibold">{SELF_CHECK.privacy}</p>
            <ol className="space-y-6">
              {SELF_CHECK.questions.map((q, i) => {
                const id = `self-${q.id}`
                const hintId = q.hint ? `${id}-hint` : undefined
                return (
                  <li key={q.id} className="rounded-2xl border bg-card p-5">
                    {q.answerType === "open" ? (
                      <div className="space-y-2">
                        <Label htmlFor={id} className="type-body-lg font-semibold">
                          <span className="sr-only">Question {i + 1}: </span>
                          {q.question}
                        </Label>
                        {q.hint && (
                          <p id={hintId} className="text-muted-foreground">
                            {q.hint}
                          </p>
                        )}
                        <Textarea id={id} aria-describedby={hintId} value={answers[q.id] ?? ""} onChange={(e) => set(q.id, e.target.value)} rows={3} />
                        <p className="text-muted-foreground">Optional notes for yourself. Not saved.</p>
                      </div>
                    ) : (
                      <fieldset aria-describedby={hintId} className="min-w-0 space-y-2">
                        <legend className="type-body-lg font-semibold">
                          <span className="sr-only">Question {i + 1}: </span>
                          {q.question}
                        </legend>
                        {q.hint && (
                          <p id={hintId} className="text-muted-foreground">
                            {q.hint}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {q.options?.map((option) => (
                            <label
                              key={option}
                              className="flex min-h-12 cursor-pointer items-center gap-2 rounded-lg border px-3 has-checked:border-archetype has-checked:bg-archetype-soft has-checked:font-bold"
                            >
                              <input
                                type="radio"
                                name={id}
                                value={option}
                                checked={answers[q.id] === option}
                                onChange={() => set(q.id, option)}
                                className="size-6 shrink-0 accent-[var(--archetype)]"
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    )}
                  </li>
                )
              })}
            </ol>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAnswers({})
                  setStatus("Your answers are cleared.")
                }}
              >
                Clear my answers
              </Button>
              <p role="status" className="text-muted-foreground">
                {status}
              </p>
            </div>
            <p className="type-body-lg">{SELF_CHECK.next}</p>
          </div>

          <aside aria-label="Official criteria and support" className="min-w-0 space-y-6">
            <section aria-labelledby="official-title" className="rounded-2xl border-2 border-archetype p-6">
              <h2 id="official-title" className="type-title-3">
                Official criteria
              </h2>
              <p className="mt-2">{SELF_CHECK.officialCriteria.text}</p>
              <a href={SELF_CHECK.officialCriteria.href} className={buttonVariants({ className: "mt-4 h-auto max-w-full py-3 whitespace-normal" })}>
                Read the Apprenticeship page
                <Icon name="external-link" />
              </a>
            </section>
            <section aria-labelledby="provides-title" className="rounded-2xl border bg-card p-6">
              <h2 id="provides-title" className="type-title-3">
                What BRIDGEGOOD provides
              </h2>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                {SELF_CHECK.whatBridgegoodProvides.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-3 text-muted-foreground">{SELF_CHECK.whatBridgegoodProvides.source}</p>
            </section>
          </aside>
        </div>
      </LibraryPage>
    </div>
  )
}
