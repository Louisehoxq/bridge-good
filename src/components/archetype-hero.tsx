import type { ReactNode } from "react"

export function ArchetypeHero({
  eyebrow,
  title,
  children,
  aside,
}: {
  eyebrow: string
  title: string
  children: ReactNode
  aside?: ReactNode
}) {
  return (
    <section aria-labelledby="hero-title" className="bg-archetype-soft">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[3fr_2fr] lg:items-center">
        <div className="space-y-5">
          <p className="text-sm font-bold tracking-wide text-archetype uppercase">{eyebrow}</p>
          <h1 id="hero-title" className="text-4xl font-bold sm:text-5xl">
            {title}
          </h1>
          <div className="space-y-4 text-lg md:text-xl">{children}</div>
        </div>
        {aside}
      </div>
    </section>
  )
}
