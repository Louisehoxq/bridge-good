import * as React from "react"
import { cn } from "cn"

/** Bridge Studio multi-line field, styled like <Input>. Pair with a visible <Label>. */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-md border-[1.5px] border-input bg-card px-3.5 py-2.5 type-body text-foreground transition-colors duration-150 ease-standard placeholder:text-muted-foreground hover:border-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 aria-invalid:border-2 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
