import * as React from "react"
import { cn } from "cn"

/**
 * Bridge Studio select (DESIGN.md section 7): a native <select> styled like the text field, 48px,
 * 1.5px line-strong border, 10px radius. It wraps long option text instead of widening the page.
 */
function NativeSelect({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
      className={cn(
        "min-h-12 w-full max-w-full min-w-0 rounded-md border-[1.5px] border-input bg-card px-3.5 py-2.5 type-body text-foreground transition-colors duration-150 ease-standard hover:border-foreground aria-invalid:border-2 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { NativeSelect }
