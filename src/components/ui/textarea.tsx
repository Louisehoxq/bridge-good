import * as React from "react"
import { cn } from "cn"

/** Material 3 outlined multi-line field. Pair with a visible <Label>. */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-28 w-full rounded-xs border border-input bg-transparent px-4 py-3 text-base text-foreground transition-colors placeholder:text-muted-foreground hover:border-foreground focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-2 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
