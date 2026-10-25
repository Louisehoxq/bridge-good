import { useId, useState, type FormEvent } from "react"
import { Link } from "react-router"
import { Icon } from "@/components/icon"
import { FieldError, personalDataError } from "@/components/feedback/fields"
import { StatusTag, TargetTag } from "@/components/feedback/tags"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { newId, nowLabel } from "@/lib/demo-store"
import { addReply, EFFECT_INFO, itemSummary } from "@/lib/feedback/logic"
import { useFeedbackItems } from "@/lib/feedback/store"
import type { FeedbackItem } from "@/lib/feedback/types"

/**
 * What happened to feedback someone sent: the steward's decision and reason, any replies, and a way to answer
 * a steward's question. Shown wherever the feedback was sent from.
 */
export function YourFeedback({ items, title = "What happened to your feedback", empty }: { items: FeedbackItem[]; title?: string; empty?: string }) {
  const id = useId()
  return (
    <section aria-labelledby={`${id}-title`} className="space-y-3">
      <h3 id={`${id}-title`} className="type-title-3">
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-muted-foreground">{empty ?? "Nothing sent yet."}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <SentItem item={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function SentItem({ item }: { item: FeedbackItem }) {
  const { decision } = item
  return (
    <article className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <StatusTag status={item.status} />
        <TargetTag target={item.target} />
        <span className="type-small text-muted-foreground">Sent {item.at}</span>
      </div>
      <p>{itemSummary(item)}</p>
      {decision && (
        <div className="rounded-lg bg-muted p-3" data-archetype="steward">
          <p className="flex items-center gap-2 font-semibold">
            <Icon name="scroll-text" />
            {decision.outcome === "accepted" ? "BRIDGEGOOD accepted this" : "BRIDGEGOOD declined this"}
            {decision.effect && <span className="font-normal">: {EFFECT_INFO[decision.effect].label.toLowerCase()}</span>}
          </p>
          <p className="mt-1">{decision.reason}</p>
          <p className="mt-1 type-small text-muted-foreground">
            {decision.by}, {decision.at}
          </p>
          {decision.changelogId && (
            <Link to={`/learn/changelog#${decision.changelogId}`} className="inline-flex min-h-12 items-center font-semibold text-primary underline underline-offset-4">
              See it in the public changelog
            </Link>
          )}
        </div>
      )}
      {item.replies.length > 0 && <Replies item={item} />}
      {item.status === "in-conversation" && <ReplyForm item={item} />}
    </article>
  )
}

export function Replies({ item, stewardView }: { item: FeedbackItem; stewardView?: boolean }) {
  return (
    <ol className="space-y-2" aria-label="Replies">
      {item.replies.map((r) => (
        <li key={r.id} className="rounded-lg border p-3">
          <p className="flex items-center gap-2 type-small font-semibold">
            <Icon name={r.from === "steward" ? "scroll-text" : "reply"} className="text-base" />
            {r.from === "steward" ? "BRIDGEGOOD steward" : stewardView ? "Sender" : "You"}
            <span className="font-normal text-muted-foreground">· {r.at}</span>
          </p>
          <p className="mt-1">{r.text}</p>
        </li>
      ))}
    </ol>
  )
}

function ReplyForm({ item }: { item: FeedbackItem }) {
  const id = useId()
  const [, setItems] = useFeedbackItems()
  const [text, setText] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)

  function submit(e: FormEvent) {
    e.preventDefault()
    const problem = !text.trim() ? "Write your reply first." : personalDataError(text)
    setError(problem)
    if (problem) return
    setItems((prev) => prev.map((i) => (i.id === item.id ? addReply(i, { id: newId(), from: "sender", text, at: nowLabel() }) : i)))
    setText("")
    setSent(true)
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-2">
      <Label htmlFor={`${id}-reply`}>Answer the steward</Label>
      <Textarea
        id={`${id}-reply`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="outline">
          <Icon name="send" />
          Send reply
        </Button>
        <p role="status">{sent ? "Reply sent to BRIDGEGOOD." : ""}</p>
      </div>
    </form>
  )
}
