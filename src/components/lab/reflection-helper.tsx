import { useEffect, useState } from "react"
import { Icon } from "@/components/icon"
import { Notice } from "@/components/notice"
import { DraftFrame } from "@/components/studio/draft-frame"
import { Button } from "@/components/ui/button"
import type { ReflectionPromptId, Scenario } from "@/content/lab"

type HelperReply = { noticed: string; questions: string[]; voiceToSeek: string }

/**
 * Optional AI reflection helper. It asks follow-up questions and never grades. Clearly labelled as AI,
 * off when no model is configured, and your own reflection always stands on its own.
 */
export function ReflectionHelper({
  scenario,
  approach,
  reasoning,
  answers,
}: {
  scenario: Scenario
  approach: string
  reasoning: string
  answers: Partial<Record<ReflectionPromptId, string>>
}) {
  const [enabled, setEnabled] = useState<boolean | null>(null)
  const [state, setState] = useState<"idle" | "loading" | "error">("idle")
  const [error, setError] = useState("")
  const [reply, setReply] = useState<HelperReply | null>(null)

  useEffect(() => {
    let live = true
    fetch("/api/reflect")
      .then((r) => r.json())
      .then((d: { enabled?: boolean }) => live && setEnabled(Boolean(d.enabled)))
      .catch(() => live && setEnabled(false))
    return () => {
      live = false
    }
  }, [])

  async function ask() {
    setState("loading")
    setError("")
    try {
      const res = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: scenario.slug, approach, reasoning, answers }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.")
      setReply(data as HelperReply)
      setState("idle")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.")
      setState("error")
    }
  }

  return (
    <section aria-labelledby="helper-title" className="rounded-xl bg-draft-soft p-5">
      <h3 id="helper-title" className="flex items-center gap-2 type-title-3">
        <Icon name="sparkles" className="text-draft" />
        Reflection helper <span className="type-small font-semibold text-draft">AI · optional</span>
      </h3>
      <p className="mt-1">
        Asks follow-up questions to deepen your reflection. It never grades you or says which approach is right. Your own
        reflection is what matters.
      </p>
      {enabled === false && (
        <Notice className="mt-3">The reflection helper isn&apos;t switched on in this demo (no AI key configured). Everything else works without it.</Notice>
      )}
      {enabled && (
        <div className="mt-3 space-y-3">
          <Button variant="outline" onClick={ask} disabled={state === "loading"}>
            {state === "loading" ? "Thinking…" : reply ? "Ask again" : "Ask for follow-up questions"}
          </Button>
          <div role="status" aria-live="polite">
            {state === "error" && <Notice tone="error">{error}</Notice>}
            {reply && (
              <DraftFrame label="AI questions · yours to answer or ignore">
                <p className="italic">{reply.noticed}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {reply.questions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
                <p className="mt-2">
                  <span className="font-semibold">A voice to seek: </span>
                  {reply.voiceToSeek}
                </p>
              </DraftFrame>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
