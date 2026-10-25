"use client"

import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { CheckCircle2Icon } from "lucide-react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export type DemoField =
  | { name: string; label: string; type: "text" | "email" | "textarea"; hint?: string; required?: boolean; autoComplete?: string; errorMessage?: string }
  | { name: string; label: string; type: "checkboxes"; hint?: string; options: string[] }

function schemaFor(fields: DemoField[]) {
  const shape: Record<string, z.ZodType> = {}
  for (const f of fields) {
    if (f.type === "checkboxes") {
      shape[f.name] = z.array(z.string())
    } else if (f.type === "email") {
      shape[f.name] = z.email(`Enter an email address, like name@example.org`)
    } else if (f.required) {
      shape[f.name] = z.string().trim().min(1, f.errorMessage ?? `Enter ${f.label.toLowerCase()}`)
    } else {
      shape[f.name] = z.string()
    }
  }
  return z.object(shape)
}

/**
 * Prototype form: validates input and confirms, but stores nothing.
 * Errors are listed in a summary that receives focus, and each field is linked to its error.
 */
export function DemoForm({
  fields,
  submitLabel,
  successTitle,
  successBody,
}: {
  fields: DemoField[]
  submitLabel: string
  successTitle: string
  successBody: string
}) {
  const formId = useId()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const summaryRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  // Move focus to the error summary or confirmation so screen reader and keyboard users land on the result.
  useEffect(() => {
    if (attempt === 0) return
    const target = submitted ? successRef.current : summaryRef.current
    target?.focus()
    target?.scrollIntoView({ block: "start" })
  }, [attempt, submitted])

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const values: Record<string, unknown> = {}
    for (const f of fields) {
      values[f.name] = f.type === "checkboxes" ? data.getAll(f.name).map(String) : String(data.get(f.name) ?? "")
    }
    const result = schemaFor(fields).safeParse(values)
    if (!result.success) {
      const next: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const key = String(issue.path[0])
        next[key] ??= issue.message
      }
      setErrors(next)
      setAttempt((n) => n + 1)
      return
    }
    setErrors({})
    setSubmitted(true)
    setAttempt((n) => n + 1)
  }

  if (submitted) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-xl border-2 border-archetype bg-archetype-soft p-6 focus:outline-none"
      >
        <CheckCircle2Icon className="mb-3 size-8 text-archetype" aria-hidden="true" />
        <h3 className="text-xl font-bold">{successTitle}</h3>
        <p className="mt-2">{successBody}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          This is a demo, so nothing you entered was stored or sent.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => setSubmitted(false)}>
          Start again
        </Button>
      </div>
    )
  }

  const errorList = Object.entries(errors)

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6 rounded-xl border bg-card p-5 sm:p-6">
      <p className="rounded-lg bg-muted px-3 py-2 text-sm">Demo form: nothing you enter is stored or sent.</p>

      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border-2 border-destructive p-4 focus:outline-none"
        >
          <h3 className="font-bold">There {errorList.length === 1 ? "is a problem" : "are some problems"} with your answers</h3>
          <ul className="mt-2 list-disc pl-5">
            {errorList.map(([name, message]) => (
              <li key={name}>
                <a href={`#${formId}-${name}`} className="text-destructive underline underline-offset-4">
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {fields.map((f) => {
        const id = `${formId}-${f.name}`
        const hintId = f.hint ? `${id}-hint` : undefined
        const error = errors[f.name]
        const errorId = error ? `${id}-error` : undefined
        const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined

        if (f.type === "checkboxes") {
          return (
            <fieldset key={f.name} aria-describedby={describedBy} className="space-y-3">
              <legend className="font-bold">{f.label}</legend>
              {f.hint && (
                <p id={hintId} className="text-sm text-muted-foreground">
                  {f.hint}
                </p>
              )}
              <div className="grid gap-2 sm:grid-cols-2" id={id}>
                {f.options.map((opt, i) => {
                  const optId = `${id}-${i}`
                  return (
                    <div key={opt} className="flex min-h-11 items-center gap-3">
                      <Checkbox id={optId} name={f.name} value={opt} />
                      <Label htmlFor={optId} className="text-base font-normal">
                        {opt}
                      </Label>
                    </div>
                  )
                })}
              </div>
            </fieldset>
          )
        }

        const required = f.type === "email" || f.required
        const common = {
          id,
          name: f.name,
          "aria-describedby": describedBy,
          "aria-invalid": error ? true : undefined,
          "aria-required": required || undefined,
          autoComplete: f.autoComplete,
        }
        return (
          <div key={f.name} className="space-y-2">
            <Label htmlFor={id} className="text-base font-bold">
              {f.label}
              {!required && <span className="font-normal text-muted-foreground"> (optional)</span>}
            </Label>
            {f.hint && (
              <p id={hintId} className="text-sm text-muted-foreground">
                {f.hint}
              </p>
            )}
            {error && (
              <p id={errorId} className="text-sm font-semibold text-destructive">
                <span className="sr-only">Error: </span>
                {error}
              </p>
            )}
            {f.type === "textarea" ? <Textarea {...common} /> : <Input type={f.type} {...common} />}
          </div>
        )
      })}

      <Button type="submit" size="lg" className="w-full bg-archetype text-white hover:bg-archetype/90 sm:w-auto">
        {submitLabel}
      </Button>
    </form>
  )
}
