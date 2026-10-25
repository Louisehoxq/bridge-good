import { Share2 } from "lucide-react"
import { useId } from "react"
import { PinnedNote } from "@/components/studio/pinned-note"
import { Button } from "@/components/ui/button"
import { DEMO_MENTOR, DEMO_STUDENT } from "@/content/seed"
import { pillarName } from "@/lib/evaluator/rubric"
import { useConversationStarters, useReflections, type KeptQuestion } from "@/lib/evaluator/store"

const ORIGIN_LABEL: Record<KeptQuestion["origin"], string> = {
  ai: "From the companion (AI)",
  "ai-edited": "From the companion (AI), reworded by you",
  prompt: "Reflection prompt",
}

const MENTOR_ORIGIN_LABEL: Record<KeptQuestion["origin"], string> = {
  ai: "AI companion's question",
  "ai-edited": "AI companion's question, reworded by the apprentice",
  prompt: "Reflection prompt",
}

/** Student side: what they've shared with their mentor, with a way to take it back. */
export function SharedWithMentor() {
  const id = useId()
  const [starters, setStarters] = useConversationStarters()
  const mine = starters.filter((s) => s.from === DEMO_STUDENT).toReversed()

  return (
    <section aria-labelledby={`${id}-title`} className="space-y-3 rounded-2xl border bg-card p-5">
      <div className="flex items-start gap-3">
        <Share2 aria-hidden="true" className="mt-1.5 size-5 shrink-0 text-primary" />
        <div>
          <h2 id={`${id}-title`} className="type-title-3">
            Shared with your mentor
          </h2>
          <p className="text-muted-foreground">
            Conversation starters for your next session with {DEMO_MENTOR}. Only the questions are shared, never your answers or
            screenshots.
          </p>
        </div>
      </div>
      {mine.length === 0 ? (
        <p>Nothing shared yet.</p>
      ) : (
        <ul className="space-y-2">
          {mine.map((s) => (
            <li key={s.id} className="space-y-1 rounded-lg bg-muted p-3">
              <p>{s.question}</p>
              <p className="type-small text-muted-foreground">
                {s.pillar ? `${pillarName(s.pillar)} · ` : ""}
                {ORIGIN_LABEL[s.origin]} · {s.sharedAt}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="-ml-3"
                aria-label={`Stop sharing: ${s.question}`}
                onClick={() => setStarters((prev) => prev.filter((x) => x.id !== s.id))}
              >
                Stop sharing
              </Button>
            </li>
          ))}
        </ul>
      )}
      <p className="type-small text-muted-foreground">{DEMO_MENTOR} sees these on their Growth conversations page.</p>
    </section>
  )
}

/** The apprentice's saved reflections, newest first, each on a pinned note. Private to them. */
export function SavedReflections() {
  const id = useId()
  const [reflections, setReflections] = useReflections()
  const list = reflections.toReversed()

  return (
    <section aria-labelledby={`${id}-title`} className="space-y-3 rounded-2xl border bg-card p-5">
      <div>
        <h2 id={`${id}-title`} className="type-title-3">
          Your reflections
        </h2>
        <p className="text-muted-foreground">Only you see these. Demo: saved in this browser.</p>
      </div>
      {list.length === 0 ? (
        <p>Nothing saved yet.</p>
      ) : (
        <ul className="space-y-4">
          {list.map((r, n) => (
            <li key={r.id}>
              <PinnedNote title={`${r.stage} · ${r.savedAt}`} tilt={n % 2 ? "right" : "left"}>
                <details>
                  <summary className="min-h-12 cursor-pointer py-3 font-semibold">
                    Your {r.questions.length} {r.questions.length === 1 ? "question" : "questions"} and answers
                  </summary>
                  <ul className="mt-2 space-y-3">
                    {r.questions.map((q, i) => (
                      <li key={i}>
                        <p className="font-bold">{q.question}</p>
                        {q.answer ? <p className="whitespace-pre-wrap">{q.answer}</p> : <p>No answer yet.</p>}
                        <p className="type-small">{ORIGIN_LABEL[q.origin]}</p>
                      </li>
                    ))}
                  </ul>
                </details>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="-ml-3"
                  aria-label={`Delete this reflection: ${r.stage}, ${r.savedAt}`}
                  onClick={() => setReflections((prev) => prev.filter((x) => x.id !== r.id))}
                >
                  Delete this reflection
                </Button>
              </PinnedNote>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/**
 * Mentor side, on the Growth conversations page. Shows questions apprentices chose to share, as starters
 * for a conversation, not as work to grade.
 */
export function MentorConversationStarters() {
  const id = useId()
  const [starters] = useConversationStarters()
  const list = starters.filter((s) => s.mentor === DEMO_MENTOR).toReversed()

  return (
    <section aria-labelledby={`${id}-title`} className="space-y-3 rounded-2xl border bg-card p-5">
      <div>
        <h2 id={`${id}-title`} className="type-title-3">
          Conversation starters from your apprentices
        </h2>
        <p className="text-muted-foreground">
          Questions an apprentice chose to share after reflecting with the AI companion. Start from their words. These aren&apos;t a grade
          or a to-do list.
        </p>
      </div>
      {list.length === 0 ? (
        <p>No questions shared yet.</p>
      ) : (
        <ul className="space-y-2">
          {list.map((s) => (
            <li key={s.id} className="rounded-lg bg-muted p-3">
              <p>{s.question}</p>
              <p className="type-small text-muted-foreground">
                {s.from} · {s.stage} · {s.pillar ? `${pillarName(s.pillar)} · ` : ""}
                {MENTOR_ORIGIN_LABEL[s.origin]} · {s.sharedAt}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
