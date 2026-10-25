"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useMemo, useRef, useState, type FormEvent } from "react"
import { BotIcon, ImagePlusIcon, SendIcon, XIcon } from "lucide-react"
import { BRIEF_FIELDS, type Brief } from "@/lib/brief"
import { newId, nowLabel, useCollection } from "@/lib/demo-store"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type SubmittedBrief = Brief & { id: string; submittedAt: string }

const STARTERS = [
  "Our website is hard for older visitors to use, and they keep calling us instead.",
  "Our sign-up form is only in English, but most families we serve speak Spanish.",
  "Here's a screenshot of our donation page. People give up halfway.",
]

const MAX_IMAGE_BYTES = 4 * 1024 * 1024

/** Two-pane desktop studio: chat with the scoping assistant on the left, the live capstone brief on the right. */
export function ScopingStudio({ aiEnabled }: { aiEnabled: boolean }) {
  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/scope" }),
  })
  const [input, setInput] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)
  const busy = status === "submitted" || status === "streaming"

  // Merge every updateBrief call, in order, into the AI's current draft.
  const aiBrief = useMemo(() => {
    const merged: Brief = {}
    for (const m of messages) {
      for (const part of m.parts) {
        if (part.type === "tool-updateBrief" && part.input && part.state !== "input-streaming") {
          Object.assign(merged, part.input as Brief)
        }
      }
    }
    return merged
  }, [messages])

  function send(text: string) {
    if (!text.trim() && files.length === 0) return
    const dt = new DataTransfer()
    files.forEach((f) => dt.items.add(f))
    sendMessage({ text: text.trim() || "Here's a screenshot.", files: files.length ? dt.files : undefined })
    setInput("")
    setFiles([])
    if (fileRef.current) fileRef.current.value = ""
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    send(input)
  }

  function onPickFiles(list: FileList | null) {
    if (!list) return
    const picked = Array.from(list)
    const tooBig = picked.filter((f) => f.size > MAX_IMAGE_BYTES)
    setFileError(tooBig.length ? "Images must be under 4 MB each." : "")
    setFiles(picked.filter((f) => f.size <= MAX_IMAGE_BYTES && f.type.startsWith("image/")))
  }

  return (
    <div className="grid gap-6 2xl:grid-cols-[1fr_1fr] xl:grid-cols-[5fr_6fr]">
      <section aria-labelledby="chat-title" className="flex min-h-[40rem] flex-col rounded-2xl border bg-card xl:sticky xl:top-20 xl:h-[calc(100vh-7rem)]">
        <header className="flex items-center gap-3 border-b p-4">
          <span className="flex size-10 items-center justify-center rounded-full bg-archetype text-white" aria-hidden="true">
            <BotIcon className="size-5" />
          </span>
          <div>
            <h2 id="chat-title" className="font-bold">
              Scoping assistant <span className="text-sm font-normal text-muted-foreground">· AI</span>
            </h2>
            <p className="text-sm text-muted-foreground">Helps draft your brief. A person at BRIDGEGOOD reviews every brief.</p>
          </div>
        </header>

        <ol className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite" aria-busy={busy}>
          {messages.length === 0 && (
            <li className="space-y-3">
              <p>
                Tell me about the problem you&apos;d like help with, in your own words. You can also add a screenshot of a
                page or product that isn&apos;t working well.
              </p>
              <p className="text-sm text-muted-foreground">
                Please don&apos;t include anyone&apos;s personal details. Describe the people you serve as a group.
              </p>
              {aiEnabled && (
                <div className="flex flex-col gap-2">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setInput(s)}
                      className="min-h-11 rounded-lg border px-3 py-2 text-left text-sm hover:bg-muted"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </li>
          )}
          {messages.map((m) => (
            <li key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[85%] space-y-2 rounded-2xl px-4 py-3", m.role === "user" ? "bg-archetype text-white" : "bg-muted")}>
                <p className="text-xs font-bold opacity-90">{m.role === "user" ? "You" : "Assistant (AI)"}</p>
                {m.parts.map((part, i) => {
                  if (part.type === "text") return <p key={i} className="whitespace-pre-wrap">{part.text}</p>
                  if (part.type === "file" && part.mediaType?.startsWith("image/"))
                    // eslint-disable-next-line @next/next/no-img-element -- data URL preview of the user's own upload
                    return <img key={i} src={part.url} alt={`Uploaded screenshot${part.filename ? `: ${part.filename}` : ""}`} className="max-h-48 rounded-lg border" />
                  if (part.type === "tool-updateBrief")
                    return (
                      <p key={i} className="text-sm italic opacity-80">
                        {part.state === "input-streaming" ? "Updating your brief…" : "Updated your brief →"}
                      </p>
                    )
                  return null
                })}
              </div>
            </li>
          ))}
          {status === "submitted" && <li className="text-sm text-muted-foreground">Thinking…</li>}
        </ol>

        {!aiEnabled ? (
          <p role="status" className="m-4 rounded-lg border-2 border-dashed p-4 text-sm">
            The AI assistant isn&apos;t switched on for this demo (no API key configured). You can still fill in the brief
            yourself on the right.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-2 border-t p-4">
            {error && (
              <p role="alert" className="rounded-lg border-2 border-destructive p-3 text-sm">
                Something went wrong talking to the assistant. Try again, or fill in the brief yourself.
              </p>
            )}
            {(files.length > 0 || fileError) && (
              <ul className="flex flex-wrap gap-2" aria-label="Attached screenshots">
                {files.map((f) => (
                  <li key={f.name} className="flex items-center gap-1 rounded-full bg-muted py-1 pr-1 pl-3 text-sm">
                    {f.name}
                    <button
                      type="button"
                      aria-label={`Remove ${f.name}`}
                      onClick={() => setFiles(files.filter((x) => x !== f))}
                      className="flex size-8 items-center justify-center rounded-full hover:bg-background"
                    >
                      <XIcon className="size-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
                {fileError && <li className="text-sm font-semibold text-destructive">{fileError}</li>}
              </ul>
            )}
            <Label htmlFor="scope-input" className="sr-only">
              Message the scoping assistant
            </Label>
            <Textarea
              id="scope-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  if (!busy) send(input)
                }
              }}
              placeholder="Describe the problem… (Enter to send, Shift+Enter for a new line)"
              rows={3}
            />
            <div className="flex items-center justify-between gap-2">
              <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm font-semibold hover:bg-muted has-focus-visible:outline-3 has-focus-visible:outline-ring">
                <ImagePlusIcon className="size-4" aria-hidden="true" />
                Add screenshot
                <input ref={fileRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => onPickFiles(e.target.files)} />
              </label>
              {busy ? (
                <Button type="button" variant="outline" onClick={() => stop()}>
                  Stop
                </Button>
              ) : (
                <Button type="submit" className="bg-archetype text-white hover:bg-archetype/90">
                  <SendIcon aria-hidden="true" />
                  Send
                </Button>
              )}
            </div>
          </form>
        )}
      </section>

      <BriefEditor aiBrief={aiBrief} />
    </div>
  )
}

function BriefEditor({ aiBrief }: { aiBrief: Brief }) {
  const [edits, setEdits] = useState<Brief>({})
  const [, setBriefs] = useCollection<SubmittedBrief>("briefs", [])
  const [errors, setErrors] = useState<string[]>([])
  const [submitted, setSubmitted] = useState<string | null>(null)
  const brief: Brief = { ...aiBrief, ...edits }

  const setField = (key: keyof Brief, value: string, list?: boolean) =>
    setEdits((prev) => ({
      ...prev,
      [key]: list ? value.split("\n").map((s) => s.trim()).filter(Boolean) : value,
    }))

  function submit(e: FormEvent) {
    e.preventDefault()
    const missing = [
      !brief.title?.trim() && "Add a project title",
      !brief.problem?.trim() && "Describe the problem",
      !brief.community?.trim() && "Describe the community affected",
    ].filter(Boolean) as string[]
    setErrors(missing)
    if (missing.length) return
    const at = nowLabel()
    setBriefs((prev) => [...prev, { ...brief, id: newId(), submittedAt: at }])
    setSubmitted(brief.title ?? "Your brief")
  }

  if (submitted) {
    return (
      <div role="status" className="h-fit rounded-2xl border-2 border-archetype bg-archetype-soft p-6">
        <h2 className="text-xl font-bold">Brief sent for review</h2>
        <p className="mt-2">
          &ldquo;{submitted}&rdquo; is with BRIDGEGOOD. In the real service, a person would review it, follow up with
          questions, and look for an ambassador and student team.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">Demo: saved in this browser only. It now appears on your overview.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            setSubmitted(null)
            setEdits({})
          }}
        >
          Start another brief
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate aria-labelledby="brief-heading" className="space-y-5 rounded-2xl border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 id="brief-heading" className="text-xl font-bold">
            Capstone brief (draft)
          </h2>
          <p className="text-sm text-muted-foreground">
            Fills in as you chat. Edit anything: your changes take priority over the assistant&apos;s.
          </p>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold">Reviewed by BRIDGEGOOD before matching</span>
      </div>
      {errors.length > 0 && (
        <div role="alert" className="rounded-lg border-2 border-destructive p-3">
          <p className="font-bold">Before sending:</p>
          <ul className="list-disc pl-5 text-destructive">
            {errors.map((er) => (
              <li key={er}>{er}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {BRIEF_FIELDS.map((f) => {
          const raw = brief[f.key]
          const value = Array.isArray(raw) ? raw.join("\n") : (raw ?? "")
          const fromAi = aiBrief[f.key] !== undefined && edits[f.key] === undefined
          const id = `brief-field-${f.key}`
          return (
            <div key={f.key} className={cn("space-y-1", (f.long || f.list) && "lg:col-span-2")}>
              <Label htmlFor={id} className="font-bold">
                {f.label}
                {fromAi && <span className="ml-2 rounded bg-archetype-soft px-1.5 py-0.5 text-xs font-semibold text-archetype">AI draft</span>}
              </Label>
              {f.list && <p className="text-xs text-muted-foreground">One per line</p>}
              {f.long || f.list ? (
                <Textarea id={id} value={value} rows={f.list ? 3 : 2} onChange={(e) => setField(f.key, e.target.value, f.list)} />
              ) : (
                <Input id={id} value={value} onChange={(e) => setField(f.key, e.target.value)} />
              )}
            </div>
          )
        })}
      </div>
      <Button type="submit" size="lg" className="bg-archetype text-white hover:bg-archetype/90">
        Send brief to BRIDGEGOOD
      </Button>
    </form>
  )
}
