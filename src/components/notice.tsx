import type { ReactNode, RefObject } from "react"
import { Icon, type IconName } from "@/components/icon"
import { cn } from "@/lib/utils"

type Tone = "success" | "error" | "warning" | "info"

const TONES: Record<Tone, { icon: IconName; className: string }> = {
  success: { icon: "circle-check", className: "bg-success-soft [&>.bgx-icon]:text-success" },
  error: { icon: "circle-alert", className: "bg-error-soft [&>.bgx-icon]:text-destructive" },
  warning: { icon: "triangle-alert", className: "bg-marker" },
  info: { icon: "info", className: "bg-muted" },
}

/**
 * Notice (DESIGN.md section 7): a soft status tint with its icon and words, so color is never the only
 * signal. For a message that appears after an action, render it inside an always-present role="status"
 * wrapper, so screen readers announce it. Errors use ErrorSummary.
 */
export function Notice({ tone = "info", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  const { icon, className: toneClass } = TONES[tone]
  return (
    <div className={cn("flex gap-3 rounded-lg border border-transparent p-3 text-foreground", toneClass, className)}>
      <Icon name={icon} className="mt-0.5" />
      <div className="min-w-0 space-y-1">{children}</div>
    </div>
  )
}

export type FieldError = { field: string; message: string }

/** Error summary: an error-soft panel at the top of a form. It takes focus on submit and links to each field. */
export function ErrorSummary({ errors, summaryRef, title }: { errors: FieldError[]; summaryRef: RefObject<HTMLDivElement | null>; title: string }) {
  if (errors.length === 0) return null
  return (
    <div ref={summaryRef} tabIndex={-1} role="alert" className="flex gap-3 rounded-lg border-2 border-destructive bg-error-soft p-3 text-foreground">
      <Icon name="circle-alert" className="mt-0.5 text-destructive" />
      <div className="min-w-0">
        <p className="font-bold">{title}</p>
        <ul className="list-disc pl-5">
          {errors.map((er) => (
            <li key={`${er.field}-${er.message}`}>
              <a href={`#${er.field}`} className="font-medium underline underline-offset-4">
                {er.message}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** The message under an invalid field. Give the field aria-invalid and aria-describedby={`${id}`}. */
export function FieldMessage({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-start gap-1.5 font-semibold text-destructive">
      <Icon name="circle-alert" className="mt-0.5" />
      <span>{children}</span>
    </p>
  )
}
