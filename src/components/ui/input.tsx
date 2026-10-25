import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

/** Material 3 outlined text field (BRIDGEGOOD's M3TextField). Pair with a visible <Label>. */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "min-h-12 w-full min-w-0 rounded-xs border border-input bg-transparent px-4 py-2 text-base text-foreground transition-colors placeholder:text-muted-foreground hover:border-foreground focus-visible:border-primary file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-2 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
