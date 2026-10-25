import { Link } from "react-router"
import { Icon } from "@/components/icon"
import { DraftNote } from "@/components/library/library-page"
import { buttonVariants } from "@/components/ui/button"
import { FRAMEWORK_META, PILLARS } from "@/content/framework"
import { LIBRARY, LIBRARY_SECTIONS } from "@/lib/library"
import { pageMeta } from "@/lib/meta"

export const meta = () => pageMeta("Library")

export default function LibraryIndex() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <header className="mb-12 max-w-3xl space-y-3">
        <h1 className="text-4xl font-bold lg:text-5xl">Library</h1>
        <p className="text-lg text-muted-foreground">
          BRIDGEGOOD&apos;s Design for Social Good framework, the questions behind it, and guides for each role. Open to
          everyone, no login needed. Read it in order, or go straight to what you need. Role areas link back here
          instead of keeping their own copies.
        </p>
        <Link to={LIBRARY[0].href} className={buttonVariants({ size: "lg" })}>
          Start with pillar 1
          <Icon name="arrow_forward" />
        </Link>
      </header>

      <div className="space-y-16">
        {LIBRARY_SECTIONS.map((section) => {
          const entries = LIBRARY.filter((e) => e.section === section.id)
          return (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-24">
              <h2 id={`${section.id}-title`} className="mb-2 text-3xl font-bold">
                {section.label}
              </h2>
              {section.id === "framework" && (
                <p className="mb-6 max-w-3xl text-muted-foreground">
                  Five pillars describe what apprentices learn. Each one has a plain meaning, an example, a learning
                  outcome and the reflection prompts that belong to it.
                </p>
              )}
              <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {entries.map((e) => {
                  const pillar = PILLARS.find((p) => e.href.endsWith(`/${p.id}`))
                  return (
                    <li key={e.href}>
                      <Link to={e.href} className="group flex h-full flex-col gap-2 rounded-2xl border bg-card p-5 hover:border-primary hover:bg-muted">
                        <span className="text-lg font-bold">{e.title}</span>
                        <span className="line-clamp-3 text-muted-foreground">{pillar ? pillar.meaning : e.summary}</span>
                        <span className="mt-auto inline-flex items-center gap-2 pt-2 font-bold text-primary">
                          Read
                          <span className="sr-only">: {e.title}</span>
                          <Icon name="arrow_forward" className="text-base transition-transform group-hover:translate-x-1" />
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
              {section.id === "framework" && (
                <div className="mt-6">
                  <DraftNote>
                    {FRAMEWORK_META.title}, version {FRAMEWORK_META.version} ({FRAMEWORK_META.status.toLowerCase()}), updated{" "}
                    {FRAMEWORK_META.updated}. {FRAMEWORK_META.note}
                  </DraftNote>
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
