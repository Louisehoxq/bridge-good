import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

/**
 * Bridge Studio text field: 48px, surface fill, 1.5px line-strong border, 10px radius.
 * Pair with a visible <Label> above it; link hints and errors with aria-describedby. The error state
 * (aria-invalid) gets a 2px error border; add an alert icon and a text message below the field.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "min-h-12 w-full min-w-0 rounded-md border-[1.5px] border-input bg-card px-3.5 py-2.5 type-body text-foreground transition-colors duration-150 ease-standard placeholder:text-muted-foreground hover:border-foreground file:inline-flex file:h-8 file:border-0 file:bg-transparent file:type-label disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 aria-invalid:border-2 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
