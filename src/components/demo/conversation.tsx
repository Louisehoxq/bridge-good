import { useState, type FormEvent } from "react"
import { Icon } from "@/components/icon"
import { newId, nowLabel, useCollection } from "@/lib/demo-store"
import { DEMO_MENTOR, SEED_MESSAGES, type Message } from "@/content/seed"
import { PeopleChip } from "@/components/studio/people-chip"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

/** One student ↔ mentor thread. `as` is who's typing. */
export function Conversation({
  thread,
  as,
  title,
  headingLevel = 2,
}: {
  thread: string
  as: "student" | "mentor"
  title: string
  headingLevel?: 2 | 3
}) {
  const H = headingLevel === 2 ? "h2" : "h3"
  const [messages, setMessages] = useCollection<Message>("messages", SEED_MESSAGES)
  const [draft, setDraft] = useState("")
  const items = messages.filter((m) => m.thread === thread)

  function send(e: FormEvent) {
    e.preventDefault()
    const body = draft.trim()
    if (!body) return
    setMessages((prev) => [
      ...prev,
      { id: newId(), thread, from: as, fromName: as === "mentor" ? DEMO_MENTOR : thread, body, at: nowLabel() },
    ])
    setDraft("")
  }

  return (
    <section aria-labelledby="conversation-title" className="flex h-full min-h-[28rem] min-w-0 flex-col rounded-xl border bg-card">
      <H id="conversation-title" className="border-b p-4 type-title-3">
        {title}
      </H>
      <div className="flex-1 overflow-y-auto p-4" role="log" aria-label="Messages">
        <ol className="space-y-3">
          {items.length === 0 && <li className="text-muted-foreground">No messages yet. Say hello.</li>}
          {items.map((m) => {
            const mine = m.from === as
            return (
              <li key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                {/* Both sides use a soft tint with ink text, so the metadata keeps full contrast. */}
                <div
                  data-archetype={m.from === "mentor" ? "mentor" : "apprentice"}
                  className={cn(
                    "max-w-[85%] min-w-0 rounded-xl border px-4 py-2 [overflow-wrap:anywhere] sm:max-w-[75%]",
                    mine ? "border-archetype bg-archetype-soft" : "bg-muted"
                  )}
                >
                  <p className="type-small font-semibold text-muted-foreground">
                    {mine ? "You" : m.fromName} · {m.at}
                    {m.synthetic && " · Synthetic example"}
                  </p>
                  <p className="mt-0.5 whitespace-pre-wrap">{m.body}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
      <form onSubmit={send} className="flex flex-wrap items-end gap-2 border-t p-4">
        <div className="min-w-48 flex-1">
          <Label htmlFor={`msg-${thread}`} className="sr-only">
            Message
          </Label>
          <Textarea
            id={`msg-${thread}`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a message"
            className="min-h-12"
            rows={2}
          />
        </div>
        <Button type="submit" className="bg-archetype text-on-archetype hover:bg-archetype/90">
          <Icon name="send" />
          Send
        </Button>
      </form>
      <p className="px-4 pb-3 type-small text-muted-foreground">
        Messages here are saved in this browser only. Real messaging would follow BRIDGEGOOD&apos;s safeguarding policy.
      </p>
    </section>
  )
}

/** Mentor view: list of student threads beside the open conversation. */
export function MentorInbox({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const [messages] = useCollection<Message>("messages", SEED_MESSAGES)
  const threads = Array.from(new Set(messages.map((m) => m.thread)))
  const [open, setOpen] = useState<string | null>(null)
  const current = open ?? threads[0]

  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
      <nav aria-label="Conversations">
        <ul className="space-y-2">
          {threads.map((t) => {
            const last = messages.filter((m) => m.thread === t).at(-1)
            return (
              <li key={t}>
                <button
                  type="button"
                  aria-current={t === current ? "true" : undefined}
                  onClick={() => setOpen(t)}
                  className="w-full space-y-2 rounded-xl border bg-card p-3 text-left hover:bg-muted aria-[current=true]:border-2 aria-[current=true]:border-archetype aria-[current=true]:bg-archetype-soft"
                >
                  <PeopleChip name={t} role="apprentice" />
                  {/* The latest message in full, wrapped: a clamp would hide text under WCAG text spacing. */}
                  {last && (
                    <span className="block text-muted-foreground [overflow-wrap:anywhere]">
                      <span className="sr-only">Latest message: </span>
                      {last.body}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      {current && <Conversation key={current} thread={current} as="mentor" title={`Conversation with ${current}`} headingLevel={headingLevel} />}
    </div>
  )
}
