import { useId, useState, type ComponentProps, type ReactNode } from "react"
import { Icon, type IconName } from "@/components/icon"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const frame = (edited: boolean) =>
  cn("rounded-[0.75rem] border-[1.5px] bg-card", edited ? "border-solid border-input" : "border-dashed border-draft")

function DraftLabel({
  edited,
  label,
  editedLabel,
  editedIcon = "pencil",
  id,
}: {
  edited: boolean
  label: ReactNode
  editedLabel: ReactNode
  editedIcon?: IconName
  id?: string
}) {
  return (
    <p id={id} className={cn("inline-flex items-center gap-1.5 type-small font-semibold", edited ? "text-muted-foreground" : "text-draft")}>
      <Icon name={edited ? editedIcon : "sparkles"} className="text-base" />
      {edited ? editedLabel : label}
    </p>
  )
}

/**
 * Draft frame: every piece of AI output sits in a dashed violet frame labelled as an AI draft, so nothing
 * AI-written looks final. Once a person edits or accepts it, pass `edited` and it turns solid with the label
 * "Edited by you".
 */
export function DraftFrame({
  edited = false,
  label = "AI draft · you decide",
  editedLabel = "Edited by you",
  children,
  className,
}: {
  edited?: boolean
  label?: ReactNode
  editedLabel?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div data-draft={edited ? "edited" : "ai"} className={cn(frame(edited), "p-4", className)}>
      <DraftLabel edited={edited} label={label} editedLabel={editedLabel} />
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

/**
 * An AI-drafted form field the person can rewrite. It shows as a draft until its text differs from the AI's,
 * then turns solid. The draft status is linked to the field with aria-describedby.
 */
export function DraftTextarea({
  label,
  draft,
  id,
  className,
  onChange,
  ...props
}: { label: ReactNode; draft: string } & Omit<ComponentProps<"textarea">, "defaultValue" | "value">) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const [value, setValue] = useState(draft)
  const edited = value !== draft

  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={fieldId}>{label}</Label>
      <div data-draft={edited ? "edited" : "ai"} className={frame(edited)}>
        <Textarea
          id={fieldId}
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            onChange?.(event)
          }}
          aria-describedby={`${fieldId}-draft`}
          className="border-0 bg-transparent hover:border-0"
          {...props}
        />
      </div>
      <DraftLabel id={`${fieldId}-draft`} edited={edited} label="AI draft · edit anything" editedLabel="Edited by you" />
    </div>
  )
}

/** Where a controlled field's text came from: the AI, or a person who edited or accepted the AI's text. */
export type DraftStatus = "ai" | "edited" | "accepted"

/**
 * The draft frame for a field whose value lives outside it (for example, a brief the AI keeps updating while you
 * chat). Put the field inside, with no border of its own, and point its aria-describedby at `statusId`.
 */
export function DraftFieldFrame({ status, statusId, children }: { status: DraftStatus; statusId: string; children: ReactNode }) {
  const edited = status !== "ai"
  return (
    <>
      <div data-draft={edited ? "edited" : "ai"} className={cn(frame(edited), "[&_[data-slot]]:border-0 [&_[data-slot]]:bg-transparent")}>
        {children}
      </div>
      <DraftLabel
        id={statusId}
        edited={edited}
        label="AI draft · edit or accept it"
        editedLabel={status === "accepted" ? "Accepted by you" : "Edited by you"}
        editedIcon={status === "accepted" ? "check" : "pencil"}
      />
    </>
  )
}
