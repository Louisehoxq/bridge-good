import Link from "next/link"
import { MenuIcon } from "lucide-react"
import { ARCHETYPE_INFO, ARCHETYPES, type Archetype } from "@/lib/archetype"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Wordmark } from "@/components/wordmark"
import { cn } from "@/lib/utils"

export function SiteHeader({ archetype }: { archetype?: Archetype }) {
  const info = archetype ? ARCHETYPE_INFO[archetype] : undefined

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="rounded-md" aria-label="BridgeGoodx home">
          <Wordmark />
        </Link>

        {info && (
          <nav aria-label={`${info.label} sections`} className="hidden md:block">
            <ul className="flex items-center gap-1">
              {info.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-flex min-h-11 items-center rounded-md px-3 font-medium text-foreground hover:bg-muted"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="flex items-center gap-2">
          {archetype && <ViewingAs archetype={archetype} className="hidden lg:flex" />}
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" size={archetype ? "icon" : "default"} aria-label={archetype ? "Open menu" : undefined} />
              }
            >
              <MenuIcon aria-hidden="true" />
              {!archetype && <span>Choose your view</span>}
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm overflow-y-auto p-6">
              <SheetHeader className="p-0">
                <SheetTitle className="text-lg">Menu</SheetTitle>
              </SheetHeader>
              {info && (
                <nav aria-label={`${info.label} sections`}>
                  <h2 className="mb-2 text-sm font-semibold text-muted-foreground">On this page</h2>
                  <ul className="flex flex-col">
                    {info.nav.map((item) => (
                      <li key={item.href}>
                        <SheetClose
                          nativeButton={false}
                          render={<a href={item.href} />}
                          className="flex min-h-11 w-full items-center rounded-md px-2 font-medium hover:bg-muted"
                        >
                          {item.label}
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
              <ArchetypeSwitcher current={archetype} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function ViewingAs({ archetype, className }: { archetype: Archetype; className?: string }) {
  return (
    <p className={cn("items-center gap-2 text-sm text-muted-foreground", className)}>
      <span className="size-2.5 rounded-full bg-archetype" aria-hidden="true" />
      Viewing as <span className="font-semibold text-foreground">{ARCHETYPE_INFO[archetype].label}</span>
    </p>
  )
}

export function ArchetypeSwitcher({ current }: { current?: Archetype }) {
  return (
    <nav aria-label="Switch view">
      <h2 className="mb-2 text-sm font-semibold text-muted-foreground">I am…</h2>
      <ul className="flex flex-col gap-2">
        {ARCHETYPES.map((a) => {
          const isCurrent = a === current
          return (
            <li key={a} data-archetype={a}>
              <Link
                href={ARCHETYPE_INFO[a].href}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-lg border px-3 py-2 font-medium hover:bg-archetype-soft",
                  isCurrent && "border-archetype bg-archetype-soft"
                )}
              >
                <span className="size-3 shrink-0 rounded-full bg-archetype" aria-hidden="true" />
                <span>
                  {ARCHETYPE_INFO[a].label}
                  {isCurrent && <span className="sr-only"> (current view)</span>}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
      <Link href="/" className="mt-3 inline-flex min-h-11 items-center rounded-md px-2 text-sm underline underline-offset-4">
        Back to the start
      </Link>
    </nav>
  )
}
