import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { ARCHETYPE_INFO, ARCHETYPES } from "@/lib/archetype"
import { ContinueAs } from "@/components/continue-as"
import { ImpactLoop } from "@/components/impact-loop"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <section aria-labelledby="hero-title" className="bg-accent">
          <div className="mx-auto max-w-6xl space-y-6 px-4 py-14 sm:px-6 md:py-24">
            <p className="text-sm font-bold tracking-wide text-primary uppercase">BRIDGEGOOD · Design for Social Good</p>
            <h1 id="hero-title" className="max-w-4xl text-4xl font-bold sm:text-5xl md:text-6xl">
              Design that starts with community, and leaves it stronger.
            </h1>
            <p className="max-w-2xl text-lg md:text-xl">
              Since 2009, BRIDGEGOOD has connected design with confidence, access, community and economic mobility. This
              is where you can learn how that works, and carry it forward wherever you are.
            </p>
            <ContinueAs />
          </div>
        </section>

        <section aria-labelledby="choose-title" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
          <h2 id="choose-title" className="text-3xl font-bold md:text-4xl">
            Who are you?
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Pick the description that fits you best. You can switch at any time from the menu.
          </p>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {ARCHETYPES.map((a) => {
              const info = ARCHETYPE_INFO[a]
              return (
                <li key={a} data-archetype={a}>
                  <Link
                    href={info.href}
                    className="group flex h-full flex-col gap-3 rounded-2xl border-2 border-border bg-card p-6 transition-colors hover:border-archetype hover:bg-archetype-soft"
                  >
                    <span className="h-1.5 w-12 rounded-full bg-archetype" aria-hidden="true" />
                    <span className="text-sm font-bold text-archetype">{info.label}</span>
                    <span className="text-xl font-bold">“{info.iAm}”</span>
                    <span className="text-muted-foreground">{info.summary}</span>
                    <span className="mt-auto inline-flex items-center gap-2 pt-2 font-bold text-archetype">
                      Go to this view
                      <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>

        <section aria-labelledby="loop-title" className="bg-muted">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
            <h2 id="loop-title" className="text-3xl font-bold md:text-4xl">
              How it fits together
            </h2>
            <p className="mt-3 mb-8 max-w-2xl text-lg text-muted-foreground">
              Each role is one part of a loop. The philosophy lives in how people work together, not in any one person.
            </p>
            <ImpactLoop />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
