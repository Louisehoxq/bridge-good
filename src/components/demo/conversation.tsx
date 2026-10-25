import { useState, type FormEvent } from "react"
import { Icon } from "@/components/icon"
import { newId, nowLabel, useCollection } from "@/lib/demo-store"
import { DEMO_MENTOR, SEED_MESSAGES, type Message } from "@/content/seed"
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
    <section aria-labelledby="conversation-title" className="flex h-full min-h-[28rem] flex-col rounded-xl border bg-card">
      <H id="conversation-title" className="border-b p-4 text-lg font-bold">
        {title}
      </H>
      <ol className="flex-1 space-y-3 overflow-y-auto p-4" role="log" aria-label="Messages">
        {items.length === 0 && <li className="text-muted-foreground">No messages yet. Say hello.</li>}
        {items.map((m) => {
          const mine = m.from === as
          return (
            <li key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[75%] min-w-0 rounded-2xl px-4 py-2 [overflow-wrap:anywhere]", mine ? "bg-archetype text-on-archetype" : "bg-muted")}>
                <p className="text-xs font-bold opacity-90">
                  {mine ? "You" : m.fromName} · {m.at}
                  {m.synthetic && " · Synthetic example"}
                </p>
                <p className="mt-0.5 whitespace-pre-wrap">{m.body}</p>
              </div>
            </li>
          )
        })}
      </ol>
      <form onSubmit={send} className="flex items-end gap-2 border-t p-4">
        <div className="flex-1">
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
      <p className="px-4 pb-3 text-xs text-muted-foreground">
        Demo messaging, stored in this browser. Real messaging would follow BRIDGEGOOD&apos;s safeguarding policy. Messages marked &ldquo;Synthetic example&rdquo; are made up.
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
                  className="w-full rounded-xl border p-3 text-left hover:bg-muted aria-[current=true]:border-archetype aria-[current=true]:bg-archetype-soft"
                >
                  <span className="block font-bold">{t}</span>
                  {last && <span className="line-clamp-1 text-sm text-muted-foreground">{last.body}</span>}
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
