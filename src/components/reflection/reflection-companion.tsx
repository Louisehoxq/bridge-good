import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"
import { CircleAlert, ImagePlus, Send, Sparkles, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import { ErrorSummary, FieldMessage, Notice, type FieldError } from "@/components/notice"
import { Button, buttonVariants } from "@/components/ui/button"
import { NativeSelect } from "@/components/ui/select"
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
export function ReflectionCompanion({ aiEnabled, modelLabel }: { aiEnabled: boolean; modelLabel: string }) {
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
  const noteErrors = errors.filter((er) => er.field === "reflect-note")

  useEffect(() => {
    if (errors.length) summaryRef.current?.focus()
  }, [errors])

  // Announce each finished reply once, instead of reading streamed text as it arrives.
  const lastStatus = useRef(status)
  useEffect(() => {
    if ((lastStatus.current === "streaming" || lastStatus.current === "submitted") && status === "ready") {
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
                <AssistantTurn
                  message={m}
                  streaming={status === "streaming" && i === messages.length - 1}
                  latest={i === messages.length - 1}
                  stage={stageLabel(stage)}
                  modelLabel={modelLabel}
                />
              )}
            </li>
          ))}
          {(preparing || status === "submitted") && <li className="text-muted-foreground">The companion is reading your work…</li>}
        </ol>
      )}

      {error && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-destructive bg-error-soft p-3">
          <p className="flex gap-2">
            <CircleAlert aria-hidden="true" className="mt-1 size-5 shrink-0 text-destructive" />
            {errorMessage(error)}
          </p>
          {messages.at(-1)?.role === "user" && (
            <Button type="button" variant="outline" onClick={() => void regenerate()}>
              Try again
            </Button>
          )}
        </div>
      )}

      {turnsLeft < 2 ? (
        <div className="rounded-2xl border bg-card p-5">
          <p>This reflection is as long as it can get. Save the questions you want to keep, then start a new one.</p>
          <Button type="button" variant="outline" className="mt-3" onClick={startOver}>
            Start a new reflection
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate aria-labelledby="reflect-form-title" className="min-w-0 space-y-5 rounded-2xl border bg-card p-4 sm:p-5 lg:p-6">
          <div>
            <h2 id="reflect-form-title" className="type-title-3">
              {started ? "Add more and ask again" : "Tell the companion about your work"}
            </h2>
            <p className="text-muted-foreground">
              {started
                ? "Say what changed, or what you'd like to look at next. The companion keeps the earlier context."
                : "A few sentences is enough. Please don't include anyone's personal details."}
            </p>
          </div>

          <ErrorSummary errors={errors} summaryRef={summaryRef} title="Before sending:" />

          {!started && (
            <div className="grid gap-5 lg:grid-cols-[16rem_1fr]">
              <div className="space-y-1">
                <Label htmlFor="reflect-stage">Stage</Label>
                <NativeSelect id="reflect-stage" value={stage} onChange={(e) => setStage(e.target.value as StageId)}>
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <fieldset className="min-w-0 space-y-1">
                <legend className="type-label">
                  Pillars to focus on <span className="font-normal text-muted-foreground">(optional)</span>
                </legend>
                <div className="flex flex-wrap gap-x-5 gap-y-1">
                  {PILLARS.map((p) => (
                    <label key={p.id} className="inline-flex min-h-12 cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={focus.includes(p.id)}
                        onChange={(e) => setFocus((prev) => (e.target.checked ? [...prev, p.id] : prev.filter((x) => x !== p.id)))}
                        className="size-6 shrink-0 accent-primary"
                      />
                      {p.name}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="reflect-note">
              {started ? "What's new" : "What you made and what you were trying to do"}
            </Label>
            <p id="reflect-note-hint" className="text-muted-foreground">
              For example: who it's for, the problem you started from, and one choice you're unsure about.
            </p>
            <Textarea
              id="reflect-note"
              value={note}
              maxLength={L.note}
              onChange={(e) => setNote(e.target.value)}
              aria-describedby={noteErrors.length ? "reflect-note-hint reflect-note-error" : "reflect-note-hint"}
              aria-invalid={noteErrors.length ? true : undefined}
              rows={5}
            />
            {noteErrors.length > 0 && <FieldMessage id="reflect-note-error">{noteErrors.map((er) => er.message).join(". ")}</FieldMessage>}
          </div>

          <div className="space-y-2">
            <p className="type-label">
              Screenshots <span className="font-normal text-muted-foreground">(optional, up to {L.images} in this reflection)</span>
            </p>
            <p id="reflect-shots-hint" className="text-muted-foreground">
              Crop out names, faces, emails and phone numbers before you upload. Screenshots are shrunk in your browser, sent with this request
              only, and not stored.
            </p>
            {files.length > 0 && (
              <ul className="space-y-2" aria-label="Attached screenshots">
                {files.map((f, i) => (
                  <li key={`${i}-${f.file.name}`} className="flex flex-wrap items-end gap-2 rounded-lg border bg-muted p-3">
                    <div className="min-w-0 flex-1 space-y-1">
                      <Label htmlFor={`reflect-shot-${i}`} className="[overflow-wrap:anywhere]">
                        Describe {f.file.name} <span className="font-normal text-muted-foreground">(optional)</span>
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
            {fileError && <FieldMessage id="reflect-shots-error">{fileError}</FieldMessage>}
            {imagesLeft - files.length > 0 && (
              <label
                className={buttonVariants({
                  variant: "outline",
                  className: "has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring",
                })}
              >
                <ImagePlus aria-hidden="true" className="size-5" />
                Add screenshots
                <input
                  ref={fileRef}
                  type="file"
                  accept={L.imageTypes.join(",")}
                  multiple
                  aria-describedby={fileError ? "reflect-shots-hint reflect-shots-error" : "reflect-shots-hint"}
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
            <p className="text-muted-foreground">The companion asks questions. It never scores or grades your work.</p>
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
    <details className="rounded-2xl border bg-muted p-4">
      <summary className="min-h-12 cursor-pointer py-3 font-bold">
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

function AssistantTurn({
  message,
  streaming,
  latest,
  stage,
  modelLabel,
}: {
  message: UIMessage
  streaming: boolean
  latest: boolean
  stage: string
  modelLabel: string
}) {
  const text = textOf(message)
  const review = useMemo(() => (streaming ? null : readReview(text)), [streaming, text])
  if (streaming) {
    return (
      <p className="flex items-center gap-2 rounded-2xl border-[1.5px] border-dashed border-draft p-4 text-draft">
        <Sparkles aria-hidden="true" className="size-5" />
        The companion (AI) is writing questions…
      </p>
    )
  }
  if (!review) {
    return (
      <p className="flex gap-2 rounded-2xl border-2 border-destructive bg-error-soft p-4">
        <CircleAlert aria-hidden="true" className="mt-1 size-5 shrink-0 text-destructive" />
        The companion&apos;s reply couldn&apos;t be read, so it isn&apos;t shown. Try asking again.
      </p>
    )
  }
  return <ReviewPanel review={review} stage={stage} messageId={message.id} modelLabel={modelLabel} latest={latest} />
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
        context: <p className="type-small font-semibold text-primary">Reflection prompt {p.id}, from BRIDGEGOOD</p>,
      })),
    []
  )
  return (
    <div className="space-y-6">
      <Notice>
        <p>
          The AI companion isn&apos;t switched on for this demo (no API key configured). You can still reflect on your own
          with BRIDGEGOOD&apos;s questions below, and share any of them with your mentor.
        </p>
      </Notice>
      <div className="rounded-2xl border bg-card p-5 lg:p-6">
        <QuestionList
          items={items}
          stage="Before you submit"
          heading="Questions to reflect on"
          headingLevel={2}
          intro={<p>Answer in your own words. Nothing is scored.</p>}
        />
      </div>
    </div>
  )
}
