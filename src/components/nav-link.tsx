"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
  const pathname = usePathname()
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex min-h-11 items-center font-medium",
        variant === "top" && "rounded-md px-3 hover:bg-muted aria-[current=page]:bg-muted aria-[current=page]:font-bold",
        variant === "side" &&
          "w-full rounded-lg border-l-4 border-transparent px-3 hover:bg-muted aria-[current=page]:border-archetype aria-[current=page]:bg-archetype-soft aria-[current=page]:font-bold",
        variant === "tab" &&
          "shrink-0 border-b-4 border-transparent px-3 whitespace-nowrap hover:bg-muted aria-[current=page]:border-archetype aria-[current=page]:font-bold"
      )}
    >
      {children}
    </Link>
  )
}
