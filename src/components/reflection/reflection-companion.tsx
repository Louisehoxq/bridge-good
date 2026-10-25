import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"
import { ImagePlus, Send, Sparkles, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PILLARS, promptsForMoment, type PillarId } from "@/content/framework"
import { findPersonalData } from "@/lib/evaluator/privacy"
import { readReview } from "@/lib/evaluator/read-review"
import { composeFirstMessage, composeFollowUp, REFLECT_LIMITS as L, STAGES, type StageId } from "@/lib/evaluator/request"
import { downscale } from "./downscale"
import { QuestionList } from "./question-list"
import { ReviewPanel } from "./review-panel"

const MAX_SOURCE_BYTES = 15 * 1024 * 1024

type Attachment = { file: File; description: string }
type FieldError = { field: string; message: string }

/** The route answers errors as { error: "…" }; show that sentence when we have it. */
function errorMessage(error: Error) {
  try {
    const parsed = JSON.parse(error.message) as { error?: string }
    if (parsed.error) return parsed.error
  } catch {
    // Not JSON: fall through to the general message.
  }
  return "Something went wrong talking to the companion. Try again, or answer the questions yourself."
}

const textOf = (m: UIMessage) =>
  m.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("")

const stageLabel = (id: StageId) => STAGES.find((s) => s.id === id)?.label ?? id

/**
 * The AI Reflection Companion: the apprentice describes their work, the companion answers with
 * questions tied to the pillars and reflection prompts, and the apprentice decides what to keep.
 */
export function ReflectionCompanion({ aiEnabled }: { aiEnabled: boolean }) {
  const [transport] = useState(() => new DefaultChatTransport({ api: "/api/reflect" }))
  const { messages, sendMessage, regenerate, setMessages, status, error, stop, clearError } = useChat({ transport })
  const [stage, setStage] = useState<StageId>("mini-project")
  const [focus, setFocus] = useState<PillarId[]>([])
  const [note, setNote] = useState("")
  const [files, setFiles] = useState<Attachment[]>([])
  const [fileError, setFileError] = useState("")
  const [errors, setErrors] = useState<FieldError[]>([])
  const [preparing, setPreparing] = useState(false)
  const [announcement, setAnnouncement] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const busy = preparing || status === "submitted" || status === "streaming"
  const started = messages.length > 0
  const imagesSent = messages.reduce((n, m) => n + m.parts.filter((p) => p.type === "file").length, 0)
  const imagesLeft = L.images - imagesSent
  const turnsLeft = L.messages - messages.length

  useEffect(() => {
    if (errors.length) summaryRef.current?.focus()
  }, [errors])

  // Announce each finished reply once, instead of reading streamed text as it arrives.
  const lastStatus = useRef(status)
  useEffect(() => {
    if (lastStatus.current === "streaming" && status === "ready") {
      const last = messages.at(-1)
      const review = last?.role === "assistant" ? readReview(textOf(last)) : null
      const count = review ? review.observations.length + review.reflectionPrompts.length : 0
      setAnnouncement(review ? `The companion replied with ${count} ${count === 1 ? "question" : "questions"}.` : "The companion's reply couldn't be read.")
    }
    lastStatus.current = status
  }, [status, messages])

  function onPickFiles(list: FileList | null) {
    if (!list) return
    const picked = Array.from(list)
    const images = picked.filter((f) => (L.imageTypes as readonly string[]).includes(f.type) && f.size <= MAX_SOURCE_BYTES)
    const next = [...files, ...images.map((file) => ({ file, description: "" }))].slice(0, imagesLeft)
    const problems = [
      images.length < picked.length && "Only PNG, JPEG or WebP images under 15 MB can be added.",
      files.length + images.length > imagesLeft && `You can add ${imagesLeft} more ${imagesLeft === 1 ? "screenshot" : "screenshots"}.`,
    ].filter(Boolean)
    setFileError(problems.join(" "))
    setFiles(next)
    if (fileRef.current) fileRef.current.value = ""
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (busy) return
    const typed = [note, ...files.map((f) => f.description)].join("\n")
    const found = findPersonalData(typed)
    const problems: FieldError[] = [
      !note.trim() && { field: "reflect-note", message: started ? "Add what changed or what you'd like to explore" : "Describe what you made" },
      found.length > 0 && {
        field: "reflect-note",
        message: `Remove the ${found.map((k) => (k === "email" ? "email address" : "phone number")).join(" and ")} before sending`,
      },
    ].filter((p): p is FieldError => Boolean(p))
    setErrors(problems)
    if (problems.length) return

    setPreparing(true)
    clearError()
    try {
      const prepared = await Promise.all(files.map((f) => downscale(f.file)))
      const described = files
        .map((f, i) => (f.description.trim() ? `Screenshot ${i + 1}: ${f.description.trim()}` : ""))
        .filter(Boolean)
      const body = [note, ...(described.length ? ["", ...described] : [])].join("\n")
      const text = started ? composeFollowUp(body, prepared.length) : composeFirstMessage({ stage, focus, note: body, imageCount: prepared.length })
      const dt = new DataTransfer()
      prepared.forEach((f) => dt.items.add(f))
      await sendMessage({ text, files: prepared.length ? dt.files : undefined })
      setNote("")
      setFiles([])
    } catch {
      setFileError("That screenshot couldn't be read. Try a PNG or JPEG.")
    } finally {
      setPreparing(false)
    }
  }

  function startOver() {
    stop()
    setMessages([])
    setNote("")
    setFiles([])
    setErrors([])
    setFileError("")
    setAnnouncement("Started a new reflection.")
  }

  if (!aiEnabled) return <OffState />

  return (
    <div className="space-y-6">
      <p role="status" className="sr-only">
        {announcement}
      </p>

      {started && (
        <ol className="space-y-6" aria-label="Your reflection so far" aria-busy={busy}>
          {messages.map((m, i) => (
            <li key={m.id}>
              {m.role === "user" ? (
                <SentNote message={m} />
              ) : (
                <AssistantTurn message={m} streaming={status === "streaming" && i === messages.length - 1} stage={stageLabel(stage)} />
              )}
            </li>
          ))}
          {(preparing || status === "submitted") && <li className="text-muted-foreground">The companion is reading your work…</li>}
        </ol>
      )}

      {error && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-destructive p-3">
          <p>{errorMessage(error)}</p>
          {messages.at(-1)?.role === "user" && (
            <Button type="button" variant="outline" onClick={() => void regenerate()}>
              Try again
            </Button>
          )}
        </div>
      )}

      {turnsLeft < 2 ? (
        <div className="rounded-2xl border p-5">
          <p>This reflection is as long as it can get. Save the questions you want to keep, then start a new one.</p>
          <Button type="button" variant="outline" className="mt-3" onClick={startOver}>
            Start a new reflection
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate aria-labelledby="reflect-form-title" className="space-y-5 rounded-2xl border bg-card p-5 lg:p-6">
          <div>
            <h2 id="reflect-form-title" className="text-xl font-bold">
              {started ? "Add more and ask again" : "Tell the companion about your work"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {started
                ? "Say what changed, or what you'd like to look at next. The companion keeps the earlier context."
                : "A few sentences is enough. Please don't include anyone's personal details."}
            </p>
          </div>

          {errors.length > 0 && (
            <div ref={summaryRef} tabIndex={-1} role="alert" aria-labelledby="reflect-errors-title" className="rounded-lg border-2 border-destructive p-3">
              <p id="reflect-errors-title" className="font-bold">
                Before sending:
              </p>
              <ul className="list-disc pl-5">
                {errors.map((er) => (
                  <li key={er.message}>
                    <a href={`#${er.field}`} className="font-medium text-destructive underline underline-offset-4">
                      {er.message}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!started && (
            <div className="grid gap-5 lg:grid-cols-[16rem_1fr]">
              <div className="space-y-1">
                <Label htmlFor="reflect-stage" className="font-bold">
                  Stage
                </Label>
                <select
                  id="reflect-stage"
                  value={stage}
                  onChange={(e) => setStage(e.target.value as StageId)}
                  className="min-h-12 w-full rounded-xs border border-input bg-transparent px-4"
                >
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <fieldset className="space-y-1">
                <legend className="text-sm font-bold">Pillars to focus on (optional)</legend>
                <div className="flex flex-wrap gap-x-5 gap-y-1">
                  {PILLARS.map((p) => (
                    <label key={p.id} className="inline-flex min-h-11 cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={focus.includes(p.id)}
                        onChange={(e) => setFocus((prev) => (e.target.checked ? [...prev, p.id] : prev.filter((x) => x !== p.id)))}
                        className="size-5 accent-primary"
                      />
                      {p.name}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="reflect-note" className="font-bold">
              {started ? "What's new" : "What you made and what you were trying to do"}
            </Label>
            <p id="reflect-note-hint" className="text-sm text-muted-foreground">
              For example: who it's for, the problem you started from, and one choice you're unsure about.
            </p>
            <Textarea
              id="reflect-note"
              value={note}
              maxLength={L.note}
              onChange={(e) => setNote(e.target.value)}
              aria-describedby={errors.some((er) => er.field === "reflect-note") ? "reflect-note-hint reflect-errors-title" : "reflect-note-hint"}
              aria-invalid={errors.some((er) => er.field === "reflect-note") ? true : undefined}
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-bold">Screenshots (optional, up to {L.images} in this reflection)</p>
            <p id="reflect-shots-hint" className="text-sm text-muted-foreground">
              Crop out names, faces, emails and phone numbers before you upload. Screenshots are shrunk in your browser, sent with this request
              only, and not stored.
            </p>
            {files.length > 0 && (
              <ul className="space-y-2" aria-label="Attached screenshots">
                {files.map((f, i) => (
                  <li key={`${i}-${f.file.name}`} className="flex flex-wrap items-end gap-2 rounded-lg bg-muted/50 p-3">
                    <div className="min-w-0 flex-1 space-y-1">
                      <Label htmlFor={`reflect-shot-${i}`} className="font-bold">
                        Describe {f.file.name} (optional)
                      </Label>
                      <Input
                        id={`reflect-shot-${i}`}
                        value={f.description}
                        maxLength={200}
                        placeholder="e.g. Sign-up screen on a phone"
                        onChange={(e) => setFiles((prev) => prev.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))}
                      />
                    </div>
                    <Button type="button" variant="ghost" size="icon" aria-label={`Remove ${f.file.name}`} onClick={() => setFiles(files.filter((x) => x !== f))}>
                      <X aria-hidden="true" className="size-5" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            {fileError && <p className="text-sm font-semibold text-destructive">{fileError}</p>}
            {imagesLeft - files.length > 0 && (
              <label className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border border-outline px-4 text-sm font-medium text-primary hover:bg-muted has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring">
                <ImagePlus aria-hidden="true" className="size-4" />
                Add screenshots
                <input
                  ref={fileRef}
                  type="file"
                  accept={L.imageTypes.join(",")}
                  multiple
                  aria-describedby="reflect-shots-hint"
                  className="sr-only"
                  onChange={(e) => onPickFiles(e.target.files)}
                />
              </label>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {busy ? (
              <Button type="button" variant="outline" onClick={() => stop()}>
                Stop
              </Button>
            ) : (
              <Button type="submit">
                <Send aria-hidden="true" className="size-4" />
                {started ? "Ask again" : "Get questions"}
              </Button>
            )}
            {started && !busy && (
              <Button type="button" variant="ghost" onClick={startOver}>
                Start a new reflection
              </Button>
            )}
            <p className="text-sm text-muted-foreground">The companion asks questions. It never scores or grades your work.</p>
          </div>
        </form>
      )}
    </div>
  )
}

/** What the apprentice sent, collapsed so the companion's questions stay in focus. */
function SentNote({ message }: { message: UIMessage }) {
  const images = message.parts.filter((p) => p.type === "file")
  return (
    <details className="rounded-2xl bg-muted/60 p-4">
      <summary className="min-h-11 cursor-pointer py-2 font-bold">
        What you sent{images.length > 0 && ` (${images.length} ${images.length === 1 ? "screenshot" : "screenshots"})`}
      </summary>
      <p className="mt-2 whitespace-pre-wrap [overflow-wrap:anywhere]">{textOf(message)}</p>
      {images.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {images.map((p, i) =>
            p.type === "file" ? (
              <li key={i}>
                <img src={p.url} alt={`Your screenshot ${i + 1}${p.filename ? `: ${p.filename}` : ""}`} className="max-h-40 rounded-lg border" />
              </li>
            ) : null
          )}
        </ul>
      )}
    </details>
  )
}

function AssistantTurn({ message, streaming, stage }: { message: UIMessage; streaming: boolean; stage: string }) {
  const text = textOf(message)
  const review = useMemo(() => (streaming ? null : readReview(text)), [streaming, text])
  if (streaming) {
    return (
      <p className="flex items-center gap-2 rounded-2xl border p-4 text-muted-foreground">
        <Sparkles aria-hidden="true" className="size-4" />
        The companion (AI) is writing questions…
      </p>
    )
  }
  if (!review) {
    return (
      <p className="rounded-2xl border-2 border-dashed p-4">
        The companion&apos;s reply couldn&apos;t be read, so it isn&apos;t shown. Try asking again.
      </p>
    )
  }
  return <ReviewPanel review={review} stage={stage} messageId={message.id} />
}

/** No API key: the page still works, with BRIDGEGOOD's own prompts for this moment. */
function OffState() {
  const items = useMemo(
    () =>
      promptsForMoment("studentSubmit").map((p) => ({
        key: `prompt-${p.id}`,
        pillar: p.pillarIds[0],
        promptIds: [p.id],
        question: p.text,
        origin: "prompt" as const,
        answerable: true,
        context: <p className="text-xs font-bold tracking-wide text-primary uppercase">Reflection prompt {p.id}</p>,
      })),
    []
  )
  return (
    <div className="space-y-6">
      <p role="status" className="rounded-2xl border-2 border-dashed border-outline p-5">
        The AI companion isn&apos;t switched on for this demo (no API key configured). You can still reflect on your own with
        BRIDGEGOOD&apos;s questions below, and share any of them with your mentor.
      </p>
      <div className="rounded-2xl border bg-card p-5 lg:p-6">
        <QuestionList
          items={items}
          stage="Before you submit"
          heading="Questions to reflect on"
          intro={<p>Answer in your own words. Nothing is scored.</p>}
        />
      </div>
    </div>
  )
}
