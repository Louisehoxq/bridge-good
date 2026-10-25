import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Highlighter: the marker color behind the one phrase that matters at a decision point, usually the
 * reflection question in focus. One per screen at most, and never on a link.
 */
export function Highlight({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <mark className={cn("rounded-xs bg-marker px-1 text-ink [box-decoration-break:clone] [-webkit-box-decoration-break:clone]", className)}>
      {children}
    </mark>
  )
}
