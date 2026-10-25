import { Info, ShieldCheck, Sparkles } from "lucide-react"
import { useId, useMemo } from "react"
import type { PillarId } from "@/content/framework"
import { findVerdictLanguage } from "@/lib/evaluator/read-review"
import { pillarName, promptText, RUBRIC_VERSION } from "@/lib/evaluator/rubric"
import type { StudentObservation, StudentReview } from "@/lib/evaluator/schema"
import { Highlight } from "@/components/studio/highlight"
import { FeedbackControls } from "./feedback-controls"
import { QuestionList, type DraftQuestion } from "./question-list"

const KIND_LABEL = { "ai-observation": "AI observation · please check", "question-only": "Question for you" } as const
// Shown on every review, whatever the model returns.
const ALWAYS_CANNOT_JUDGE =
  "Lived experience, and how real people experience your work. Only you, your mentor and the community you're designing with can judge that."
const EVIDENCE_LABEL = { "visible-in-image": "In your screenshot", "quoted-text": "In your note", absent: "Not there yet" } as const

function PillarTag({ pillar, promptIds }: { pillar: PillarId; promptIds?: number[] }) {
  return (
    <p className="type-small font-semibold text-primary">
      {pillarName(pillar)}
      {promptIds && promptIds.length > 0 && <span className="text-muted-foreground"> · prompt {promptIds.join(", ")}</span>}
    </p>
  )
}

function Evidence({ items }: { items: StudentObservation["evidence"] }) {
  return (
    <ul className="space-y-0.5 text-muted-foreground">
      {items.map((e, i) => (
        <li key={i}>
          <span className="font-semibold">{EVIDENCE_LABEL[e.kind]}:</span> {e.where}
        </li>
      ))}
    </ul>
  )
}

/** "How this was made" (docs/ai-evaluator.md, section 5): what produced the review and where it stops. */
export function HowThisWasMade({ review, modelLabel }: { review: StudentReview; modelLabel: string }) {
  const observations = review.observations.filter((o) => o.kind === "ai-observation").length
  const questions = review.observations.length - observations
  return (
    <details className="rounded-xl border bg-muted p-4">
      <summary className="flex min-h-12 cursor-pointer items-center gap-2 font-bold">
        <Info aria-hidden="true" className="size-4" />
        How this was made
      </summary>
      <dl className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-[auto_1fr]">
        <dt className="font-bold">Made by</dt>
        <dd>AI: {modelLabel}, reading your note and screenshots</dd>
        <dt className="font-bold">Rubric</dt>
        <dd>
          BRIDGEGOOD Design for Social Good rubric, version {review.rubricVersion || RUBRIC_VERSION}
        </dd>
        <dt className="font-bold">What&apos;s in it</dt>
        <dd>
          {observations} AI {observations === 1 ? "observation" : "observations"} to check, {questions} {questions === 1 ? "question" : "questions"}{" "}
          only people can answer, and no automated checks (a screenshot isn&apos;t an audit).
        </dd>
        <dt className="font-bold">Scores</dt>
        <dd>None. The companion can&apos;t score, grade or pass work. Its output format has no place for one.</dd>
        <dt className="font-bold">Privacy</dt>
        <dd>Screenshots were sent with this request only and aren&apos;t stored. Your choices stay in this browser.</dd>
      </dl>
      <p className="mt-3 font-semibold">This is AI. It can be wrong. Your mentor and BRIDGEGOOD decide what counts.</p>
    </details>
  )
}

/**
 * One finished review from the companion, in three labelled parts: what's working, what to explore
 * (questions you can edit, keep and share), and what it can't judge.
 */
export function ReviewPanel({
  review,
  stage,
  messageId,
  modelLabel,
  latest = true,
}: {
  review: StudentReview
  stage: string
  messageId: string
  modelLabel: string
  /** Only the latest review highlights its first reflection prompt: one highlight per screen. */
  latest?: boolean
}) {
  const id = useId()
  const verdictWords = useMemo(() => findVerdictLanguage(review), [review])

  const items = useMemo<DraftQuestion[]>(
    () => [
      ...review.observations.map((o, i) => ({
        key: `${messageId}-o${i}`,
        pillar: o.pillar,
        promptIds: o.promptIds,
        question: o.question,
        origin: "ai" as const,
        answerable: false,
        context: (
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-draft bg-draft-soft px-2.5 py-0.5 type-small font-semibold text-draft">
                <Sparkles aria-hidden="true" className="size-4" />
                {KIND_LABEL[o.kind]}
              </span>
              {o.kind === "ai-observation" && <span className="type-small text-muted-foreground">Confidence in what it noticed: {o.confidence}</span>}
            </div>
            <PillarTag pillar={o.pillar} promptIds={o.promptIds} />
            <p>
              <span className="font-bold">I noticed:</span> {o.noticed}
            </p>
            <Evidence items={o.evidence} />
          </div>
        ),
        footer: <FeedbackControls pillar={o.pillar} kind={o.kind} />,
      })),
      ...review.reflectionPrompts.map((p, i) => ({
        key: `${messageId}-p${i}`,
        promptIds: [p.promptId],
        question: p.question,
        origin: "ai" as const,
        answerable: true,
        context: (
          <p className="text-muted-foreground">
            <span className="font-bold">Reflection prompt {p.promptId}:</span>{" "}
            {latest && i === 0 ? <Highlight>{promptText(p.promptId)}</Highlight> : promptText(p.promptId)}
          </p>
        ),
      })),
    ],
    [review, messageId, latest]
  )

  return (
    // The whole review is AI output, so it sits in the dashed draft frame. Questions turn solid one by one as you make them yours.
    <article aria-labelledby={`${id}-title`} data-draft="ai" className="min-w-0 space-y-6 rounded-2xl border-[1.5px] border-dashed border-draft bg-card p-4 sm:p-5 lg:p-6">
      <header className="space-y-2">
        <p className="inline-flex items-center gap-1.5 type-small font-semibold text-draft">
          <Sparkles aria-hidden="true" className="size-4" />
          AI draft · you decide
        </p>
        <h2 id={`${id}-title`} className="type-title-3">
          Reflection companion (AI)
        </h2>
        <p>{review.summary}</p>
      </header>

      {review.personalDataNoticed && (
        <p role="note" className="flex gap-2 rounded-lg border-2 border-destructive bg-error-soft p-3">
          <ShieldCheck aria-hidden="true" className="mt-1 size-5 shrink-0 text-destructive" />
          Your note or screenshots seem to include personal details. The companion won&apos;t repeat them. Crop out names, faces, emails and
          phone numbers before you share this work with anyone.
        </p>
      )}
      {verdictWords.length > 0 && (
        <p role="note" className="rounded-lg bg-marker p-3 text-ink">
          This reply used judging words ({verdictWords.map((w) => `“${w}”`).join(", ")}). The companion isn&apos;t meant to judge your work.
          Use &ldquo;Not right&rdquo; to tell BRIDGEGOOD.
        </p>
      )}

      <section aria-labelledby={`${id}-working`} className="space-y-3">
        <h3 id={`${id}-working`} className="type-title-3">
          What&apos;s working
        </h3>
        {review.strengths.length === 0 ? (
          <p className="text-muted-foreground">The companion didn&apos;t name any strengths it could point to. That isn&apos;t a judgment of your work.</p>
        ) : (
          <ul className="grid gap-3 lg:grid-cols-2">
            {review.strengths.map((s, i) => (
              <li key={i} className="space-y-1 rounded-xl border bg-muted p-4">
                <PillarTag pillar={s.pillar} />
                <p>{s.noticed}</p>
                <Evidence items={s.evidence} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {items.length === 0 ? (
        <section aria-labelledby={`${id}-explore`} className="space-y-2">
          <h3 id={`${id}-explore`} className="type-title-3">
            What to explore
          </h3>
          <p className="text-muted-foreground">No questions this time. Add more about what you made and try again.</p>
        </section>
      ) : (
        <QuestionList
          items={items}
          stage={stage}
          heading="What to explore"
          intro={
            <p>
              Questions, not answers. Reword any of them. Nothing is kept or shared unless you tick it. &ldquo;AI observation&rdquo; means
              something it saw that you should check. &ldquo;Question for you&rdquo; is something only people can answer.
            </p>
          }
        />
      )}

      <section aria-labelledby={`${id}-cant`} className="space-y-2 rounded-xl border border-dashed p-4">
        <h3 id={`${id}-cant`} className="type-title-3">
          What I can&apos;t judge
        </h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>{ALWAYS_CANNOT_JUDGE}</li>
          {review.cannotJudge.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
        <p>
          <span className="font-bold">Who to talk to next:</span> {review.humanNext}
        </p>
      </section>

      <HowThisWasMade review={review} modelLabel={modelLabel} />
    </article>
  )
}
