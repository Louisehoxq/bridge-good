import { useState, type FormEvent } from "react"
import { Link, useLocation } from "react-router"
import { YourFeedback } from "@/components/feedback/your-feedback"
import { Icon } from "@/components/icon"
import { Breadcrumbs } from "@/components/library/library-page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { findByReplyCode } from "@/lib/feedback/logic"
import { useFeedbackItems } from "@/lib/feedback/store"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Check BRIDGEGOOD's reply")

/**
 * Where a group outside BRIDGEGOOD reads the steward's reply with their code. No account, no email.
 * The code works like a key, so it never goes in the URL: links here pass it in the page's state.
 */
export default function KitReply() {
  const location = useLocation()
  const [items] = useFeedbackItems()
  const [code, setCode] = useState(() => String((location.state as { code?: string } | null)?.code ?? ""))
  const item = code ? findByReplyCode(items, code) : undefined

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setCode(String(new FormData(e.currentTarget).get("code") ?? "").trim())
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Breadcrumbs
        items={[
          { label: "Library", href: "/learn" },
          { label: "Carry it forward", href: "/learn/carry-it-forward" },
          { label: "Check a reply" },
        ]}
      />
      <header className="mb-8 space-y-3">
        <h1 className="type-title-1">Check BRIDGEGOOD&apos;s reply</h1>
        <p className="type-body-lg text-muted-foreground">
          Enter the code you got when you told BRIDGEGOOD what you changed. You&apos;ll see whether a steward has replied or decided,
          and you can answer a question they asked.
        </p>
      </header>

      <form onSubmit={submit} className="mb-10 flex flex-wrap items-end gap-3 rounded-2xl border bg-card p-4 sm:p-6">
        <div className="min-w-0 flex-1 basis-60 space-y-1.5">
          <Label htmlFor="reply-code">Your reply code</Label>
          <p id="reply-code-hint" className="type-small text-muted-foreground">
            Like BG-7KQ4-M2XP. Capitals and dashes don&apos;t matter.
          </p>
          <Input id="reply-code" key={code} name="code" defaultValue={code} autoComplete="off" spellCheck={false} aria-describedby="reply-code-hint" className="font-mono" />
        </div>
        <Button type="submit">
          <Icon name="key-round" />
          Check
        </Button>
      </form>

      {code && !item && (
        <div role="status" className="space-y-2 rounded-2xl border border-dashed p-5">
          <p className="flex items-center gap-2 font-semibold">
            <Icon name="info" />
            No feedback with that code in this browser.
          </p>
          <p>
            Check the code for typos. In this demo, feedback is kept in the browser it was sent from, so a code from another
            device won&apos;t work here.
          </p>
        </div>
      )}

      {item && (
        <section aria-labelledby="reply-result" className="space-y-3">
          <h2 id="reply-result" className="type-title-2">
            What BRIDGEGOOD said
          </h2>
          <YourFeedback items={[item]} title={`Your feedback, code ${item.replyCode}`} />
          {item.status === "new" && <p className="text-muted-foreground">No reply yet. A steward reads every note. Check back here with the same code.</p>}
        </section>
      )}

      <p className="mt-10 text-muted-foreground">
        Demo: try the synthetic example code{" "}
        <Link to="/learn/carry-it-forward/reply" state={{ code: "BG-DEMO-7Q4X" }} replace onClick={() => setCode("BG-DEMO-7Q4X")} className="font-mono underline underline-offset-4">
          BG-DEMO-7Q4X
        </Link>
        .{" "}
        <Link to="/learn/carry-it-forward" className="underline underline-offset-4">
          Back to the kit
        </Link>
      </p>
    </article>
  )
}
