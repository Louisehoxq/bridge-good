import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import { Icon } from "@/components/icon"
import { BRIEF_FIELDS, type Brief } from "@/lib/brief"
import { DECISION_MOMENT_INFO, promptsForMoment } from "@/content/framework"
import { newId, nowLabel, useCollection } from "@/lib/demo-store"
import { ErrorSummary, FieldMessage, Notice, type FieldError } from "@/components/notice"
import { DraftFieldFrame, DraftFrame, type DraftStatus } from "@/components/studio/draft-frame"
import { Highlight } from "@/components/studio/highlight"
import { RoleBadge } from "@/components/studio/role-badge"
import { Button, buttonVariants } from "@/components/ui/button"
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

// Match the limits in src/routes/api.scope.ts.
const MAX_IMAGES = 4
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"]
const MAX_SOURCE_BYTES = 15 * 1024 * 1024
const MAX_EDGE_PX = 1568

/** Shrink a screenshot to at most 1568px on its longest side as a JPEG, so requests stay small. */
async function downscale(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_EDGE_PX / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext("2d")
  if (!ctx) return file
  ctx.fillStyle = "#fff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85))
  if (!blob) return file
  return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" })
}

/** The scoping route answers errors as { error: "…" }; show that sentence when we have it. */
function errorMessage(error: Error) {
  try {
    const parsed = JSON.parse(error.message) as { error?: string }
    if (parsed.error) return parsed.error
  } catch {
    // Not JSON: fall through to the general message.
  }
  return "Something went wrong talking to the assistant. Try again, or fill in the brief yourself."
}

/** Two-pane desktop studio: chat with the scoping assistant on the left, the live project brief on the right. */
export function ScopingStudio({ aiEnabled }: { aiEnabled: boolean }) {
  const [transport] = useState(() => new DefaultChatTransport({ api: "/api/scope" }))
  const { messages, sendMessage, setMessages, status, error, stop } = useChat({ transport })
  const [input, setInput] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState("")
  const [preparing, setPreparing] = useState(false)
  const [announcement, setAnnouncement] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const busy = preparing || status === "submitted" || status === "streaming"

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

  // Keep the newest message in view.
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages, status])

  // Announce each finished reply once, instead of reading streamed text as it arrives.
  const lastStatus = useRef(status)
  useEffect(() => {
    if ((lastStatus.current === "streaming" || lastStatus.current === "submitted") && status === "ready") {
      const last = messages.at(-1)
      const updated = last?.parts.some((p) => p.type === "tool-updateBrief")
      setAnnouncement(updated ? "The assistant replied and updated your brief." : "The assistant replied.")
    }
    lastStatus.current = status
  }, [status, messages])

  async function send(text: string) {
    if (busy || (!text.trim() && files.length === 0)) return
    setPreparing(true)
    try {
      const prepared = await Promise.all(files.map(downscale))
      const dt = new DataTransfer()
      prepared.forEach((f) => dt.items.add(f))
      await sendMessage({ text: text.trim() || "Here's a screenshot.", files: prepared.length ? dt.files : undefined })
      setInput("")
      setFiles([])
      if (fileRef.current) fileRef.current.value = ""
    } catch {
      setFileError("That screenshot couldn't be read. Try a PNG or JPEG.")
    } finally {
      setPreparing(false)
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    void send(input)
  }

  function onPickFiles(list: FileList | null) {
    if (!list) return
    const picked = Array.from(list)
    const images = picked.filter((f) => IMAGE_TYPES.includes(f.type) && f.size <= MAX_SOURCE_BYTES)
    const next = [...files, ...images].slice(0, MAX_IMAGES)
    const problems = [
      images.length < picked.length && "Only PNG, JPEG or WebP images under 15 MB can be added.",
      files.length + images.length > MAX_IMAGES && `You can add up to ${MAX_IMAGES} screenshots.`,
    ].filter(Boolean)
    setFileError(problems.join(" "))
    setFiles(next)
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[5fr_6fr] 2xl:grid-cols-[1fr_1fr]">
      <section aria-labelledby="chat-title" className="flex min-h-[32rem] flex-col rounded-2xl border bg-card xl:sticky xl:top-20 xl:h-[calc(100vh-7rem)]">
        <header className="flex items-center gap-3 border-b p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed border-draft bg-draft-soft text-draft" aria-hidden="true">
            <Icon name="sparkles" />
          </span>
          <div className="min-w-0">
            <h2 id="chat-title" className="type-title-3">
              Scoping assistant (AI)
            </h2>
            <p className="text-muted-foreground">Helps draft your brief. You decide what goes in it, and a person at BRIDGEGOOD reviews every brief.</p>
          </div>
        </header>

        <p role="status" className="sr-only">
          {announcement}
        </p>

        {/* Focusable so keyboard users can scroll the transcript. Replies are announced once, by the status above. */}
        <div ref={listRef} role="region" aria-label="Conversation" tabIndex={0} className="max-h-[70vh] flex-1 overflow-y-auto p-4 xl:max-h-none">
        <ol className="space-y-4" aria-busy={busy}>
          {messages.length === 0 && (
            <li className="space-y-3">
              <p>
                Tell me about the problem you&apos;d like help with, in your own words. You can also add a screenshot of a
                page or product that isn&apos;t working well.
              </p>
              <p className="text-muted-foreground">
                Please don&apos;t include anyone&apos;s personal details. Describe the people you serve as a group.
              </p>
              {aiEnabled && (
                <div className="flex flex-col gap-2">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setInput(s)}
                      className="min-h-12 rounded-md border-[1.5px] border-input bg-card px-3 py-2 text-left hover:bg-muted"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </li>
          )}
          {messages.map((m) => {
            const parts = m.parts.map((part, i) => {
              if (part.type === "text") return <p key={i} className="whitespace-pre-wrap">{part.text}</p>
              if (part.type === "file" && part.mediaType?.startsWith("image/"))
                return <img key={i} src={part.url} alt={`Uploaded screenshot${part.filename ? `: ${part.filename}` : ""}`} className="max-h-48 rounded-lg border" />
              if (part.type === "tool-updateBrief")
                return (
                  <p key={i} className="flex items-center gap-1.5 text-muted-foreground">
                    <Icon name="pencil" />
                    {part.state === "input-streaming" ? "Drafting brief fields…" : "Drafted brief fields for you to check."}
                  </p>
                )
              return null
            })
            return (
              <li key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                {m.role === "user" ? (
                  <div className="max-w-[85%] min-w-0 space-y-2 rounded-xl border border-archetype bg-archetype-soft px-4 py-3 [overflow-wrap:anywhere]">
                    <p className="type-small font-semibold text-muted-foreground">You</p>
                    {parts}
                  </div>
                ) : (
                  // Every assistant reply sits in the AI draft frame, so nothing it writes looks final.
                  <DraftFrame label="Assistant (AI)" className="max-w-[92%] min-w-0 space-y-2 [overflow-wrap:anywhere]">
                    <div className="space-y-2">{parts}</div>
                  </DraftFrame>
                )}
              </li>
            )
          })}
          {(preparing || status === "submitted") && <li className="text-muted-foreground">Thinking…</li>}
        </ol>
        </div>

        {!aiEnabled ? (
          <Notice className="m-4">
            <p>
              The AI assistant isn&apos;t switched on for this demo (no API key configured). You can still fill in the brief
              yourself.
            </p>
          </Notice>
        ) : (
          <form onSubmit={onSubmit} className="space-y-2 border-t p-4">
            {error && (
              <div role="alert" className="flex gap-3 rounded-lg border-2 border-destructive bg-error-soft p-3">
                <Icon name="circle-alert" className="mt-0.5 text-destructive" />
                <p>{errorMessage(error)}</p>
              </div>
            )}
            {(files.length > 0 || fileError) && (
              <ul className="flex flex-wrap gap-2" aria-label="Attached screenshots">
                {files.map((f, i) => (
                  <li key={`${i}-${f.name}`} className="flex max-w-full min-w-0 items-center gap-1 rounded-md border bg-muted py-1 pr-1 pl-3">
                    <span className="min-w-0 [overflow-wrap:anywhere]">{f.name}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${f.name}`}
                      onClick={() => setFiles(files.filter((x) => x !== f))}
                      className="flex size-10 shrink-0 items-center justify-center rounded-md hover:bg-background"
                    >
                      <Icon name="x" className="text-base" />
                    </button>
                  </li>
                ))}
                {fileError && (
                  <li>
                    <FieldMessage id="scope-file-error">{fileError}</FieldMessage>
                  </li>
                )}
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
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault()
                  void send(input)
                }
              }}
              placeholder="Describe the problem…"
              aria-describedby="scope-input-hint"
              rows={3}
            />
            <p id="scope-input-hint" className="type-small text-muted-foreground">
              Press Enter to send, or Shift+Enter for a new line.
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                className={buttonVariants({
                  variant: "outline",
                  className: "has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring",
                })}
              >
                <Icon name="image-plus" />
                Add screenshot
                <input
                  ref={fileRef}
                  type="file"
                  accept={IMAGE_TYPES.join(",")}
                  multiple
                  className="sr-only"
                  aria-describedby={fileError ? "scope-file-error" : undefined}
                  onChange={(e) => onPickFiles(e.target.files)}
                />
              </label>
              {busy ? (
                <Button type="button" variant="outline" onClick={() => stop()}>
                  Stop
                </Button>
              ) : (
                <Button type="submit" className="bg-archetype text-on-archetype hover:bg-archetype/90">
                  <Icon name="send" />
                  Send
                </Button>
              )}
            </div>
          </form>
        )}
      </section>

      <BriefEditor aiBrief={aiBrief} onStartOver={() => setMessages([])} />
    </div>
  )
}

const REQUIRED: { key: keyof Brief; message: string }[] = [
  { key: "title", message: "Add a project title" },
  { key: "problem", message: "Describe the problem" },
  { key: "community", message: "Describe the community affected" },
  { key: "communityShaping", message: "Say how the people you serve will shape this" },
]

const asText = (value: Brief[keyof Brief]) => (Array.isArray(value) ? value.join("\n") : (value ?? ""))
const asList = (text: string) => text.split("\n").map((s) => s.trim()).filter(Boolean)

function BriefEditor({ aiBrief, onStartOver }: { aiBrief: Brief; onStartOver: () => void }) {
  // The person's edits, kept as the raw text they typed. Lists are split into items only when sending.
  const [edits, setEdits] = useState<Partial<Record<keyof Brief, string>>>({})
  // Fields where the person kept the AI's text as it is. Accepting turns the draft frame solid.
  const [accepted, setAccepted] = useState<Partial<Record<keyof Brief, true>>>({})
  const [, setBriefs] = useCollection<SubmittedBrief>("briefs", [])
  const [errors, setErrors] = useState<FieldError[]>([])
  const [submitted, setSubmitted] = useState<string | null>(null)
  const [status, setStatus] = useState("")
  const summaryRef = useRef<HTMLDivElement>(null)
  const doneRef = useRef<HTMLHeadingElement>(null)

  const text = (key: keyof Brief) => edits[key] ?? asText(aiBrief[key])
  const draftStatus = (key: keyof Brief): DraftStatus | undefined => {
    if (edits[key] !== undefined) return edits[key] === asText(aiBrief[key]) && accepted[key] ? "accepted" : aiBrief[key] !== undefined ? "edited" : undefined
    return aiBrief[key] !== undefined ? "ai" : undefined
  }

  useEffect(() => {
    if (errors.length) summaryRef.current?.focus()
  }, [errors])

  useEffect(() => {
    if (submitted) doneRef.current?.focus()
  }, [submitted])

  function submit(e: FormEvent) {
    e.preventDefault()
    const missing = REQUIRED.filter((r) => !text(r.key).trim()).map((r) => ({ field: `brief-field-${r.key}`, message: r.message }))
    setErrors(missing)
    if (missing.length) return
    const brief: Brief = {}
    for (const f of BRIEF_FIELDS) {
      const value = text(f.key).trim()
      if (!value) continue
      Object.assign(brief, { [f.key]: f.list ? asList(value) : value })
    }
    setBriefs((prev) => [...prev, { ...brief, id: newId(), submittedAt: nowLabel() }])
    setSubmitted(brief.title ?? "Your brief")
  }

  function accept(key: keyof Brief, label: string) {
    setEdits((prev) => ({ ...prev, [key]: asText(aiBrief[key]) }))
    setAccepted((prev) => ({ ...prev, [key]: true }))
    setStatus(`${label}: accepted as written.`)
  }

  const aiFields = BRIEF_FIELDS.filter((f) => draftStatus(f.key) === "ai")

  if (submitted) {
    return (
      <div className="h-fit rounded-2xl border-2 border-archetype bg-archetype-soft p-6">
        <h2 ref={doneRef} tabIndex={-1} className="flex items-center gap-2 type-title-3">
          <Icon name="circle-check" />
          Brief sent for review
        </h2>
        <p className="mt-2">
          &ldquo;{submitted}&rdquo; is with BRIDGEGOOD. In the real service, a person would review it, follow up with
          questions, and look for an ambassador and apprentice team.
        </p>
        <p className="mt-2 text-muted-foreground">Demo: saved in this browser only. It now appears on your overview and on My project and team.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            setSubmitted(null)
            setEdits({})
            setAccepted({})
            setErrors([])
            onStartOver()
          }}
        >
          Start another brief
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate aria-labelledby="brief-heading" className="min-w-0 space-y-5 rounded-2xl border bg-card p-4 sm:p-6">
      <p role="status" className="sr-only">
        {status}
      </p>
      <div className="space-y-2">
        <h2 id="brief-heading" className="type-title-3">
          Project brief (draft)
        </h2>
        <p className="text-muted-foreground">
          Fills in as you chat. Anything the assistant writes sits in a dashed frame marked &ldquo;AI draft&rdquo;. Edit it, or
          accept it as written, and it becomes yours. Your changes always take priority.
        </p>
        <RoleBadge role="steward">Reviewed by BRIDGEGOOD before matching</RoleBadge>
      </div>
      <ErrorSummary errors={errors} summaryRef={summaryRef} title="Before sending:" />
      <div className="grid gap-4 lg:grid-cols-2">
        {BRIEF_FIELDS.map((f) => {
          const id = `brief-field-${f.key}`
          const error = errors.find((er) => er.field === id)
          const required = REQUIRED.some((r) => r.key === f.key)
          const draft = draftStatus(f.key)
          const describedBy = [(f.list || f.hint) && `${id}-hint`, draft && `${id}-draft`, error && `${id}-error`].filter(Boolean).join(" ") || undefined
          const fieldProps = {
            id,
            value: text(f.key),
            "aria-invalid": error ? true : undefined,
            "aria-describedby": describedBy,
            onChange: (e: { target: { value: string } }) => {
              setEdits((prev) => ({ ...prev, [f.key]: e.target.value }))
              setAccepted((prev) => ({ ...prev, [f.key]: undefined }))
            },
          }
          const field = f.long || f.list ? <Textarea rows={f.list ? 3 : 2} {...fieldProps} /> : <Input {...fieldProps} />
          return (
            <div key={f.key} className={cn("min-w-0 space-y-1", (f.long || f.list) && "lg:col-span-2")}>
              <Label htmlFor={id}>
                {f.label}
                {required && <span className="ml-1 font-normal text-muted-foreground">(required)</span>}
              </Label>
              {(f.list || f.hint) && (
                <p id={`${id}-hint`} className="text-muted-foreground">
                  {f.hint ?? "One per line"}
                </p>
              )}
              {draft ? (
                <DraftFieldFrame status={draft} statusId={`${id}-draft`}>
                  {field}
                </DraftFieldFrame>
              ) : (
                field
              )}
              {draft === "ai" && (
                <div>
                  <Button type="button" variant="ghost" size="sm" className="-ml-3" onClick={() => accept(f.key, f.label)}>
                    <Icon name="check" />
                    Accept as written
                    <span className="sr-only">: {f.label}</span>
                  </Button>
                </div>
              )}
              {error && <FieldMessage id={`${id}-error`}>{error.message}</FieldMessage>}
            </div>
          )
        })}
      </div>
      {aiFields.length > 0 && (
        <Notice tone="warning">
          <p className="font-bold">
            {aiFields.length === 1 ? "1 field is" : `${aiFields.length} fields are`} still an AI draft.
          </p>
          <p>
            Read {aiFields.length === 1 ? "it" : "them"} before you send, then edit or accept. You can still send it: a person at
            BRIDGEGOOD goes through every brief with you before anything happens.
          </p>
        </Notice>
      )}
      <div className="rounded-xl border bg-muted p-4">
        <p className="font-bold">{DECISION_MOMENT_INFO.partnerBrief.label}</p>
        <p>{DECISION_MOMENT_INFO.partnerBrief.intro}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {promptsForMoment("partnerBrief").map((p, i) => (
            <li key={p.id}>{i === 0 ? <Highlight>{p.text}</Highlight> : p.text}</li>
          ))}
        </ul>
      </div>
      <Button type="submit" size="lg" className="h-auto bg-archetype py-3 whitespace-normal text-on-archetype hover:bg-archetype/90">
        Send brief to BRIDGEGOOD
      </Button>
    </form>
  )
}
