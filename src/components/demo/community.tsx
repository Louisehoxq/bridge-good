import { useState, type FormEvent } from "react"
import { newId, nowLabel, useCollection } from "@/lib/demo-store"
import { CIRCLES, DEMO_STUDENT, SEED_POSTS, type Post } from "@/content/seed"
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
                onClick={() => setCircle(c.id)}
                className="w-full rounded-xl border p-3 text-left hover:bg-muted aria-[current=true]:border-archetype aria-[current=true]:bg-archetype-soft"
              >
                <span className="block font-bold">{c.name}</span>
                <span className="text-sm text-muted-foreground">{c.description}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <section aria-labelledby="circle-title" className="space-y-4">
        <h2 id="circle-title" className="text-2xl font-bold">
          {current.name}
        </h2>
        <form onSubmit={post} className="space-y-2 rounded-xl border bg-card p-4">
          <Label htmlFor="post-body" className="font-bold">
            Share something with the circle
          </Label>
          <Textarea id="post-body" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="A tip, a question, a win…" />
          <Button type="submit" className="bg-archetype text-on-archetype hover:bg-archetype/90">
            Post
          </Button>
        </form>
        <ul className="space-y-3">
          {items.map((p) => (
            <li key={p.id} className="rounded-xl border bg-card p-4">
              <p className="text-sm">
                <span className="font-bold">{p.author}</span> <span className="text-muted-foreground">· {p.at}</span>
              </p>
              <p className="mt-1">{p.body}</p>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          Circles are peer spaces. Be kind, credit others&apos; ideas, and don&apos;t share anyone&apos;s personal story
          without permission.
        </p>
      </section>
    </div>
  )
}
