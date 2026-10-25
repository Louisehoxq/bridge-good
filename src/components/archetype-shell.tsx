import type { ReactNode } from "react"
import type { Archetype } from "@/lib/archetype"
import { RememberArchetype } from "@/components/remember-archetype"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

/** Shared frame for every archetype view. `data-archetype` sets the accent colour. */
export function ArchetypeShell({ archetype, children }: { archetype: Archetype; children: ReactNode }) {
  return (
    <div data-archetype={archetype} className="flex min-h-full flex-col">
      <RememberArchetype archetype={archetype} />
      <SiteHeader archetype={archetype} />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
