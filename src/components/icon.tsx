import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

/**
 * Material Symbols Rounded names used in the app. root.tsx loads only these glyphs from Google Fonts,
 * so add a name here before using it.
 */
export const ICON_NAMES = [
  "accessibility_new",
  "add_photo_alternate",
  "arrow_forward",
  "auto_awesome",
  "calendar_clock",
  "calendar_today",
  "check",
  "close",
  "description",
  "group",
  "location_on",
  "login",
  "mail",
  "menu",
  "open_in_new",
  "play_circle",
  "schedule",
  "send",
  "smart_toy",
] as const

export type IconName = (typeof ICON_NAMES)[number]

/** Decorative icon. Always pair it with visible text or an aria-label on the control. */
export function Icon({ name, filled, className, ...props }: { name: IconName; filled?: boolean } & ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      translate="no"
      className={cn("material-symbols-rounded inline-block shrink-0 select-none", className)}
      style={filled ? { fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24' } : undefined}
      {...props}
    >
      {name}
    </span>
  )
}

/** Google Fonts URL that subsets Material Symbols Rounded to ICON_NAMES (the list must be sorted). */
export const ICON_FONT_URL = `https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0..1,0&icon_names=${[...ICON_NAMES].sort().join(",")}&display=block`
