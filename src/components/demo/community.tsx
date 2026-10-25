import { useState, type FormEvent } from "react"
import { newId, nowLabel, useCollection } from "@/lib/demo-store"
import { CIRCLES, DEMO_STUDENT, SEED_POSTS, type Post } from "@/content/seed"
import { PeopleChip } from "@/components/studio/people-chip"
import { SyntheticBadge } from "@/components/synthetic-badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function CommunityOfPractice() {
  const [posts, setPosts] = useCollection<Post>("posts", SEED_POSTS)
  const [circle, setCircle] = useState(CIRCLES[0].id)
  const [draft, setDraft] = useState("")
  const [status, setStatus] = useState("")
  const current = CIRCLES.find((c) => c.id === circle)!
  const items = posts.filter((p) => p.circle === circle).toReversed()

  function post(e: FormEvent) {
    e.preventDefault()
    if (!draft.trim()) return
    setPosts((prev) => [...prev, { id: newId(), circle, author: DEMO_STUDENT, body: draft.trim(), at: nowLabel() }])
    setDraft("")
    setStatus("Posted to the circle.")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
      <p role="status" className="sr-only">
        {status}
      </p>
      <nav aria-label="Circles">
        <ul className="space-y-2">
          {CIRCLES.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                aria-current={c.id === circle ? "true" : undefined}
                onClick={() => {
                  setCircle(c.id)
                  setStatus(`Showing ${c.name}.`)
                }}
                className="w-full rounded-xl border bg-card p-3 text-left hover:bg-muted aria-[current=true]:border-2 aria-[current=true]:border-archetype aria-[current=true]:bg-archetype-soft"
              >
                <span className="block font-bold">{c.name}</span>
                <span className="text-muted-foreground">{c.description}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <section aria-labelledby="circle-title" className="min-w-0 space-y-4">
        <h2 id="circle-title" className="type-title-2">
          {current.name}
        </h2>
        <form onSubmit={post} className="space-y-2 rounded-xl border bg-card p-4">
          <Label htmlFor="post-body">Share something with the circle</Label>
          <p id="post-hint" className="text-muted-foreground">
            Circles are peer spaces. Be kind, credit others&apos; ideas, and don&apos;t share anyone&apos;s personal story
            without permission.
          </p>
          <Textarea id="post-body" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="A tip, a question, a win…" aria-describedby="post-hint" />
          <Button type="submit" className="bg-archetype text-on-archetype hover:bg-archetype/90">
            Post
          </Button>
        </form>
        <ul className="space-y-3">
          {items.map((p) => (
            <li key={p.id} className="space-y-2 rounded-xl border bg-card p-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <PeopleChip name={p.author} role="apprentice" you={p.author === DEMO_STUDENT} />
                <span className="type-small text-muted-foreground">{p.at}</span>
                {p.synthetic && <SyntheticBadge />}
              </div>
              <p className="[overflow-wrap:anywhere]">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
