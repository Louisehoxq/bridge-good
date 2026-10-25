import { ThumbsDown, ThumbsUp } from "lucide-react"
import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import type { PillarId } from "@/content/framework"
import { newId, nowLabel } from "@/lib/demo-store"
import { RUBRIC_VERSION } from "@/lib/evaluator/rubric"
import { useEvaluatorFeedback, type EvaluatorFeedback } from "@/lib/evaluator/store"

const REASONS = ["Factually wrong", "Misses context", "Culturally off", "Tone felt harsh", "Not relevant to this stage"]

/**
 * Useful / Not right on one AI item (docs/ai-evaluator.md, section 6). Only the rubric item and the
 * reason are saved, never the apprentice's work, so BRIDGEGOOD can see where the rubric misses.
 */
export function FeedbackControls({ pillar, kind }: { pillar: PillarId; kind: "ai-observation" | "question-only" }) {
  const id = useId()
  const [, setFeedback] = useEvaluatorFeedback()
  const [verdict, setVerdict] = useState<"useful" | "not-right" | null>(null)
  const [reason, setReason] = useState("")
  const [entryId, setEntryId] = useState<string | null>(null)

  function record(next: "useful" | "not-right", nextReason?: string) {
    const entry: EvaluatorFeedback = {
      id: entryId ?? newId(),
      at: nowLabel(),
      rubricVersion: RUBRIC_VERSION,
      lens: "student",
      pillar,
      observationKind: kind,
      verdict: next,
      reason: nextReason || undefined,
    }
    setEntryId(entry.id)
    setFeedback((prev) => [...prev.filter((f) => f.id !== entry.id), entry])
    setVerdict(next)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Was this useful?">
        <Button type="button" variant="outline" size="sm" aria-pressed={verdict === "useful"} onClick={() => record("useful")} className="aria-pressed:border-primary aria-pressed:bg-muted">
          <ThumbsUp aria-hidden="true" className="size-4" />
          Useful
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-pressed={verdict === "not-right"}
          onClick={() => record("not-right", reason)}
          className="aria-pressed:border-primary aria-pressed:bg-muted"
        >
          <ThumbsDown aria-hidden="true" className="size-4" />
          Not right
        </Button>
        {verdict && <span className="text-muted-foreground">Thanks. This helps BRIDGEGOOD improve the rubric.</span>}
      </div>
      {verdict === "not-right" && (
        <div className="max-w-sm space-y-1">
          <Label htmlFor={`${id}-reason`}>
            What&apos;s not right? <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <NativeSelect
            id={`${id}-reason`}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              record("not-right", e.target.value)
            }}
          >
            <option value="">Choose a reason</option>
            {REASONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </NativeSelect>
        </div>
      )}
    </div>
  )
}
