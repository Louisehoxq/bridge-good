import { Link, useLocation } from "react-router"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Link that marks itself with aria-current when its route is active. */
export function NavLink({
  href,
  exact,
  variant,
  children,
}: {
  href: string
  exact?: boolean
  variant: "top" | "side" | "tab"
  children: ReactNode
}) {
  const { pathname } = useLocation()
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      to={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex min-h-12 items-center gap-2.5 font-medium",
        variant === "top" &&
          "rounded-md px-3 whitespace-nowrap underline-offset-[6px] hover:bg-muted aria-[current=page]:bg-muted aria-[current=page]:font-bold aria-[current=page]:underline aria-[current=page]:decoration-2",
        variant === "side" &&
          // Only the current item draws its bar: a transparent border would show as a line in forced-colors mode.
          "w-full rounded-md pr-3 pl-4 hover:bg-card aria-[current=page]:border-l-4 aria-[current=page]:border-archetype aria-[current=page]:bg-card aria-[current=page]:pl-3 aria-[current=page]:font-bold [&_.bgx-icon]:text-muted-foreground aria-[current=page]:[&_.bgx-icon]:text-archetype",
        variant === "tab" &&
          "shrink-0 px-3 pb-1 whitespace-nowrap hover:bg-muted aria-[current=page]:border-b-4 aria-[current=page]:border-archetype aria-[current=page]:pb-0 aria-[current=page]:font-bold"
      )}
    >
      {children}
    </Link>
  )
}
