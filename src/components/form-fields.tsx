import { type ReactNode } from "react"
import { Icon } from "@/components/icon"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { containsContactDetails } from "@/lib/playbook"
import { cn } from "@/lib/utils"

/** Field errors keyed by field id, in the order they appear on the form. */
export type FieldErrors = Record<string, string>

/** Personal-data screen for free text: email addresses and phone numbers never go to BRIDGEGOOD. */
export function personalDataError(text: string) {
  return containsContactDetails(text) ? "Take out email addresses and phone numbers. BRIDGEGOOD doesn't need them to read your feedback." : ""
}

/** A labelled textarea with an optional hint and an error, both linked with aria-describedby. */
export function TextField({
  id,
  name,
  label,
  hint,
  error,
  optional,
  value,
  defaultValue,
  onChange,
  rows,
}: {
  id: string
  name?: string
  label: ReactNode
  hint?: ReactNode
  error?: string
  optional?: boolean
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  rows?: number
}) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {optional && <span className="font-normal text-muted-foreground">(optional)</span>}
      </Label>
      {hint && (
        <p id={`${id}-hint`} className="type-small text-muted-foreground">
          {hint}
        </p>
      )}
      <Textarea
        id={id}
        name={name ?? id}
        rows={rows}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  )
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-start gap-1.5 font-semibold text-destructive">
      <Icon name="circle-alert" className="mt-0.5" />
      {children}
    </p>
  )
}

/** Error summary: focused on submit, links to each field (DESIGN.md section 7). */
export function ErrorSummary({ errors, labels, summaryRef }: { errors: FieldErrors; labels: Record<string, string>; summaryRef: React.RefObject<HTMLDivElement | null> }) {
  const entries = Object.entries(errors)
  if (entries.length === 0) return null
  return (
    <div ref={summaryRef} tabIndex={-1} role="alert" aria-labelledby={`${entries[0][0]}-summary-title`} className="rounded-xl border-2 border-destructive bg-error-soft p-4">
      <p id={`${entries[0][0]}-summary-title`} className="flex items-center gap-2 font-semibold">
        <Icon name="circle-alert" />
        {entries.length === 1 ? "Fix one thing before sending" : `Fix ${entries.length} things before sending`}
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-6">
        {entries.map(([id, message]) => (
          <li key={id}>
            <a href={`#${id}`} className="underline underline-offset-4">
              {labels[id] ?? id}: {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** A native radio group: 24px controls inside 48px rows, with a legend. */
export function RadioGroup<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  className,
}: {
  name: string
  legend: ReactNode
  options: { value: T; label: ReactNode; hint?: ReactNode }[]
  value: T | undefined
  onChange: (value: T) => void
  error?: string
  className?: string
}) {
  return (
    <fieldset id={name} className={cn("space-y-1", className)} aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="mb-1 type-label">{legend}</legend>
      {options.map((o) => (
        <label key={o.value} className="flex min-h-12 cursor-pointer items-start gap-3 rounded-md py-2">
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            className="mt-0.5 size-6 shrink-0 accent-primary"
          />
          <span>
            <span className="block">{o.label}</span>
            {o.hint && <span className="block type-small text-muted-foreground">{o.hint}</span>}
          </span>
        </label>
      ))}
      {error && <FieldError id={`${name}-error`}>{error}</FieldError>}
    </fieldset>
  )
}

/** One consent checkbox for credit in the public changelog. Unchecked by default. */
export function CreditConsent({ id, checked, onChange, creditAs }: { id: string; checked: boolean; onChange: (v: boolean) => void; creditAs: string }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-describedby={`${id}-hint`}
        className="mt-3 size-6 shrink-0 accent-primary"
      />
      <div>
        <label htmlFor={id} className="flex min-h-12 cursor-pointer items-center">
          Credit {creditAs} in the public changelog if BRIDGEGOOD accepts this (optional)
        </label>
        <p id={`${id}-hint`} className="type-small text-muted-foreground">
          Leave it unticked and BRIDGEGOOD won&apos;t name you. You can still see what happened.
        </p>
      </div>
    </div>
  )
}
